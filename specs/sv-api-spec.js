jasmine.getEnv().addReporter(new jasmine.ConsoleReporter(console.log));

var proxyquire = require('proxyquire');
var oauthwrap = require('oauth-wrap');
var Promise = require('promise');
var http = require('http');
var rp = require('request-promise');

var httpRequestStub = {};
var unzipStub = {};

describe("sv-api.isirs", function() {	
	var svApi = proxyquire('../sv-api.js', {'request-promise': httpRequestStub, 'unzip': unzipStub });

	beforeEach(function() {

		httpRequestStub.post = function(options) {
			expect(options.url).toBeDefined();
			expect(options.headers).toBeDefined();
			expect(options.headers.Authorization).toBeDefined();
			return new Promise(function(resolve, reject) {
				resolve({ statusCode: 202 });
			})};		

		httpRequestStub.get = function(options) {
			expect(options.url).toBeDefined();
			expect(options.headers).toBeDefined();
			expect(options.headers.Authorization).toBeDefined();
			return new Promise(function(resolve, reject) {
				resolve({ statusCode: 200, body: { 'test' : 'somecontent' } });
			})};	

		unzipStub.parse = function() {
			this.emit('close');
		}; 
	});

	var isirs = svApi.isirs;

	it('is defined', function() {
		expect(isirs).toBeDefined();
	});

	it('defines isirs.upload function', function() {
		expect(isirs.upload).toBeDefined();		
	});

	it('defines isirs.getCorrections function', function() {
		expect(isirs.getCorrections).toBeDefined();		
	});

	it('.upload executes an http POST', function(done) {
		isirs.upload("", "", "2014-2015", "")
			.then(function(body) {
				//console.log('status code: ', body.statusCode);
				expect(body.statusCode).toBe(202);
				done();
			});
	});
});

describe("sv-api.documents", function() {
	var svApi = proxyquire('../sv-api.js', {'request-promise': httpRequestStub, 'unzip': unzipStub });	
	var documents = svApi.documents;

	it('is defined', function() {
		expect(documents).toBeDefined();
	});

	it('defines documents.getMetadata function', function() {
		expect(documents.getMetadata).toBeDefined();		
	});

	it('defines documents.getFiles function', function() {
		expect(documents.getFiles).toBeDefined();		
	});
});

describe("", function() {
	var svApi = require('../sv-api');
	var isirs = svApi.isirs;
	var docs = svApi.documents;
	var server;
	var lastResponseBody;

	beforeEach(function() {

        server = http.createServer(function (request, response) {
            (bodyParser.json())(request, response, function () {
                var path = url.parse(request.url).pathname;
                console.log('!!!!!!!!!!!!!!!!!path: ', path);

                var status = parseInt(path.split('/')[1]);
                if(isNaN(status)) { status = 555; }
                if (status === 302) {
                    response.writeHead(status, { location: '/200' });
                    lastResponseBody = '';
                    response.end();
                } else {
                    response.writeHead(status, { 'Content-Type': 'application/octet-stream' });
                    var body = {};
                    lastResponseBody = {};
                    setTimeout(null, 2000);
                    response.end(lastResponseBody);
                }
            });
        });
        server.listen(4000, function () {
            done();
        });
	});	

	it('documents.getMetadata executes an http Get', function(done) {
		docs.getMetadata('http://localhost/4000:200', '', '')
			.then(done());
	});

	xit('.getCorrections executes an http GET', function(done) {
		isirs.getCorrections('http://localhost:4000/200', '', '', '')
			.then(function(body) {
				expect(body.statusCode).toBe(200);
				done();
			})
			.catch(function(error) {
				console.log(error.stack);
				done(error);
			});
	});
})
