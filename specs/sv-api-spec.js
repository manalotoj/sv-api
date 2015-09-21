jasmine.getEnv().addReporter(new jasmine.ConsoleReporter(console.log));

var proxyquire = require('proxyquire');
var oauthwrap = require('oauth-wrap');
var promise = require('promise');
var httpRequestStub = {};
var svApi = proxyquire('../sv-api.js', {'request-promise': httpRequestStub });


describe("sv-api.isirs", function() {	
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
				resolve({ statusCode: 200 });
			})};		 
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

	it('.getCorrections executes an http GET', function(done) {
		isirs.getCorrections("", "", "", "")
			.then(function(body) {
				//console.log('status code: ', body.statusCode);
				expect(body.statusCode).toBe(200);
				done();
			});
	});
});

describe("sv-api.documents", function() {
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