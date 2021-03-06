/** 
* @module sv-api
* @description Exposes operations supported by StudentVerification RESTful API.
* Operations are grouped in the following classes:
*		isirs
*		documents
*		requirements	
*/

'use strict';

var fs = require('fs');
var Promise = require('promise');
var httpRequest = require('request-promise');
var Request = require('request');
var unzip = require('unzip');
var MemoryStream = require('memorystream');
var logger = require('./logger');
/** 
* @Class isirs
* @description Represents functions associated with ISIR files
*/

var svApi = { logger: logger };

var isirs = {
	/**
	* @description upload a file as application/octet-stream content
	* @param {string} rootUrl url of awardletter API
	* @param {string} authorization header value
	* @param {string} awardYear Award/aid year in [YYYY]-[YYYY] format; ex. 2015-2016
	* @param {object} content JSON content to be uploaded
	* @returns {function} A promise.
	*   Any response whose status code is not 2xx will result in a rejected promise.
	*/	
	upload: function(rootUrl, authorization, awardYear, content) {

	  var options = {
	    url: rootUrl + "isir?" + awardYear,
	    headers: {
	      'Authorization': authorization,
	      'Content-Type': 'application/octet-stream'
	    },
	    body: JSON.stringify(content)
	  };  

	  return httpRequest.post(options);
  	},
	/**
	* @description Get batched ISIR corrections for a given start date and end date
	* @param {string} rootUrl url of awardletter API
	* @param {string} authorization header value
	* @param {string} startDate A start date in MM-DD-YYYY format
	* @param {string} endDate An end date in MM-DD-YYYY format
	* @param {string} targetPath An optional target path in which files will be written
	* @returns {function} A promise.
	*   The promise will resolve with an array of objects containing the metadata associated with
	*   0 or more ISIR correction files. Each array element is an object with the following properties:
	*'			{ name: 'file name', type: 'file type', content: file_content }
	*	If a targetPath is not provided, the content property will be a **memorystream** object
	*	contain the contents of the file (refer to https://github.com/JSBizon/node-memorystream).
	*	Any response with a status code that is not 2xx  will result in a rejected promise.
	*/
	getCorrections: function(rootUrl, authorization, startDate, endDate, targetPath) {
	
		var options = {
		url: rootUrl + 'correction/zip?startDate=' + startDate + '&endDate=' + endDate,
		headers: { 'Authorization': authorization }
		};  

		var request = httpRequest.get(options);

		var parsedFiles = [];
		var promise = new Promise(function(resolve, reject) {

			request
			  	.on('error', function(error) {
		  			svApi.logger.error('Error encountered while retrieving file(s) from SV API: ', error.stack);
		  			reject(error);
			  	})
				.pipe(unzip.Parse())
				.on('error', function(error) {
					svApi.logger.error('Error encountered while unzipping ISIR corrections: ', error.stack);
					reject(error);
				})				
				.on('entry', function (entry) {
					try {
						var fileName = entry.path.replace('/', '-');
						var type = entry.type; // 'Directory' or 'File'

						if (type === 'File') {							
							svApi.logger.debug('getCorrections > file found: ', fileName);
							
							var destination;
							var stream;
							if (targetPath && targetPath.length > 0) {
								destination = fs.createWriteStream(targetPath + '/' + fileName);
								entry.pipe(destination);
								svApi.logger.debug('getCorrections > ', fileName, ' piped to ', targetPath + '/' + fileName);
							} else {
								stream = new MemoryStream(null, { readable: false });
								entry.pipe(stream);
								svApi.logger.debug('getCorrections > ', fileName, ' piped to stream');
							}
							parsedFiles.push({ name: fileName, type: type, content: stream });
						}						
					} catch(error) {
						svApi.logger.error('Error encountered while processing correction file: ', error);
						reject(error);
					}
					})
					.on('close', function(){
						svApi.logger.debug('getCorrection: close fired');
						resolve(parsedFiles);
					})
			});
		return promise;
	}
}

/** 
* @Class documents
* @description Represents functions associated with student documents
*/
var documents = {
	/**
	*	@description Get student document metadata.
	* @param {string} rootUrl url of awardletter API
	* @param {string} authorization header value
	* @param  {string} documentId The unique Id of the student document
	* @returns {function} A promise.
	*       The promise will resolve with the metadata in JSON string format.
	*		Any response with a status code that is not 2xx  will result in a rejected promise.
	**/
	getMetadata: function(rootUrl, authorization, documentId) {
	  var options = {
	    url: rootUrl + 'document/' + documentId + '/metadata',
	    headers: { 'Authorization': authorization }
	  };  

	  return httpRequest.get(options);
	},

	/**
	*	Get student document file(s).
	*	@returns {function} A promise.
	*		The promise will resolve with an array of unzipped file(s).
	*		Each array element is an object with the following properties:
	*'			{ name: 'file name', type: 'file type', content: file_content }
	*		Any response with a status code that is not 2xx  will result in a rejected promise.
	**/	
	
	/**
	* Get files for a given student document.
	* @param {string} rootUrl url of awardletter API
	* @param {string} authorization header value
	* @param {string} documentId The unique Id of the student document
	* @param {string} targetPath An optional target path in which files will be written
	* @return {function} A promise.
	*	If a targetPath is not provided, the content property will be a **memorystream** object
	*	contain the contents of the file (refer to https://github.com/JSBizon/node-memorystream).
	*      Any response with a status code that is not 2xx  will result in a rejected promise.
	*/
	getFiles: function(rootUrl, authorization, documentId, targetPath) {
	  var options = {
	  	url: rootUrl + 'document/' + documentId + '/zip',
		headers: { 'Authorization': authorization }
	  };  

	  var parsedFiles = [];
	  var request = httpRequest.get(options);
	  var promise = new Promise(function(resolve, reject) {
	  	request
  			.pipe(unzip.Parse())
			.on('entry', function (entry) {
				try {
					var fileName = entry.path;
					var type = entry.type; // 'Directory' or 'File'

					if (type === 'File') {
						svApi.logger.debug('getFiles > file found: ', fileName);
						var destination;
						var stream;

						if (targetPath && targetPath.length > 0) {							
							destination = fs.createWriteStream(targetPath + '/' + documentId + '-' + fileName);
							entry.pipe(destination);
							svApi.logger.debug('getFiles > ', documentId + '-' + fileName, ' piped to ', targetPath + '/' + fileName);
						} else {
							stream = new MemoryStream(null, { readable: false });
							entry.pipe(stream);
						}
						parsedFiles.push({ name: documentId + '-' + fileName, type: type, content: stream });
					}
				} catch(error) {
					svApi.logger.error('Error encountered while processing student file: ', error);
					reject(error);
				}
			})
			.on('close', function() {
				resolve(parsedFiles);
			})
		  	.on('error', function(error) {
	  			svApi.logger.error('Error encountered while retrieving student file(s): ', error);
	  			reject(error);
		  	});
	  });
	  return promise;
	},

	/**
	*	Get student document metadata and associated file(s).
	* @param {string} rootUrl url of awardletter API
	* @param {string} authorization header value
	* @param {string} documentId The unique Id of the student document
	* @returns {function} A promise.
	*		The promise resolves to an array of results. The first element will contain
	*		the metadata while the second element will contain the file(s).
	*		Any response with a status code that is not 2xx  will result in a rejected promise.
	**/
	get: function(rootUrl, authorization, documentId, targetPath) {
		var promises = [];
		promises.push(this.getMetadata(rootUrl, authorization, documentId, targetPath));
		promises.push(this.getFiles(rootUrl, authorization, documentId, targetPath));

		return Promise.all(promises);
	}
}

/** 
* @Class requirements
* @description Represents functions associated with student requirements/tasks
*/
var requirements = {

}

svApi.isirs = isirs;
svApi.requirements = requirements;
svApi.documents = documents;

module.exports = svApi;