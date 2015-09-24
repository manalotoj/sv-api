jasmine.getEnv().addReporter(new jasmine.ConsoleReporter(console.log));

var config = require('./integration.config.json');
var fse = require('fs-extra');
var proxyquire = require('proxyquire');
var oauthwrap = require('oauth-wrap');
var promise = require('promise');
var httpRequestStub = {};
var svApi = proxyquire('../sv-api.js', {'request-promise': httpRequestStub });

describe("sv-api integration", function(){	
	var authorization;		
	var rootUrl = config.svApi.rootUrl;

	describe(".isirs", function() {

		var isirs = svApi.isirs;

		beforeEach(function(done) {
			oauthwrap.getAuthHeader(
				config.oauthWrapRequest.url, 
				config.oauthWrapRequest.creds.uid, 
				config.oauthWrapRequest.creds.pwd, 
				config.oauthWrapRequest.wrapScope)
				.then(function(response) {					
					authorization = response;
					done();
				})
				.catch(function(error) {
					done(new Error(error));
				})
		});		

		it('authorization was retrieved', function() {
			expect(authorization.length).not.toBe(0);
		});	

		it('getCorrections with null target returns unzipped file contents', function(done) {

			isirs.getCorrections(rootUrl, authorization, '09-21-2015', '09-21-2015', null)
				.then(function(result) {
					expect(result.length).not.toBe(0);
					expect(result[0].content).toBeDefined();
					expect(result[0].content.length).not.toBe(0);
					//console.log('* here is some content: ', result[0].content.toString());
					done();					
				})
				.catch(function(error) { 
					done(new Error('should have been resolved'));
				});			
		});

		it('getCorrections with empty target returns unzipped file contents', function(done) {

			isirs.getCorrections(rootUrl, authorization, '09-21-2015', '09-21-2015', '')
				.then(function(result) {
					expect(result.length).not.toBe(0);
					expect(result[0].content).toBeDefined();
					expect(result[0].content.length).not.toBe(0);
					done();					
				})
				.catch(function(error) { 
					done(new Error('should have been resolved'));
				});			
		});

		it('getCorrections with target writes unzipped files to disk', function(done) {
			var targetDir = './target';
			isirs.getCorrections(rootUrl, authorization, '09-21-2015', '09-21-2015', targetDir)
				.then(function(result) {
					expect(result.length).not.toBe(0);
					expect(result[0].content).not.toBeDefined();
					try {

						for (i = 0; i < result[i].length; i++) {
							expect(result[i].name).toBeDefined();
							expect(result[i].content).not.toBeDefined();
							expect(fse.existsSync(targetDir + '/' + result[i].name));												
						}
						done();
					} finally {
						fse.emptyDirSync(targetDir);
					}
					done();					
					done();										
				})
				.catch(function(error) {
					console.log(error);
					done(new Error('should have been resolved'));
				});			
		});								
	});

	describe(".documents", function() {

		beforeEach(function(done) {
			oauthwrap.getAuthHeader(
				'https://studentverification.accesscontrol.windows.net/WRAPv0.9/', 
				'dev_local_system', 
				'Cl.123456', 
				'https://apiqa.studentverification.com:5443/')
				.then(function(response) {					
					authorization = response;
					done();
				})
				.catch(function(error) {
					console.log('*** error: ', error);
				})
		});		
		
		var documents = svApi.documents;

		it('authorization was retrieved', function() {
			expect(authorization.length).not.toBe(0);
		});	

		it('getFiles returns unzipped file contents', function(done) {			
			documents.getFiles(rootUrl, authorization, "27888")
				.then(function(result) {
					expect(result.length).toBe(3);
					for(i = 0; i<3; i++)
						expect(result[0].content.length).not.toBe(0);
					done();					
				}).catch(function(error) { 
					done(new Error(error));
				});
			
		});

		it('getMetadata returns document metadata', function(done) {
			documents.getMetadata(rootUrl, authorization, "27888")
				.then(function(result) {
					var metadata = JSON.parse(result);
					expect(metadata.documentName).toBeDefined();
					expect(metadata.documentType).toBeDefined();
					expect(metadata.studentId).toBeDefined();
					expect(metadata.awardYear).toBeDefined();
					done();
				})
				.catch(function(error) {
					console.log(error);
					done(new Error('this should have been resolved.'))
				});
		});

		it('get returns document metadata and associated files', function(done) {
			documents.get(rootUrl, authorization, "27888")
				.then(function(result) {
					expect(result).toBeDefined();
					expect(result.length).toBe(2);

					var metadata = JSON.parse(result[0]);
					expect(metadata.documentName).toBeDefined();

					var files = result[1];
					expect(files.length).toBe(3);
					expect(files[0].content).toBeDefined();
					expect(files[0].content.length).not.toBe(0);

					done();
				})
				.catch(function(error) {
					console.log(error);
					done(new Error('this should have been resolved.'))
				});
		});

		it('get writes files to targetPath', function(done) {
			var targetDir = './target';
			documents.get(rootUrl, authorization, "27888", targetDir)
				.then(function(result) {
					var files = result[1];
					try {

						for (i = 0; i < files[i].length; i++) {
							expect(files[i].name).toBeDefined();
							expect(files[i].content).not.toBeDefined();
							expect(fse.existsSync(targetDir + '/' + files[i].name));												
						}
						done();
					} finally {
						fse.emptyDirSync(targetDir);
					}
					done();
				})
				.catch(function(error) {
					console.log(error);
					done(new Error('this should have been resolved.'))
				});
		});		

	});
});

