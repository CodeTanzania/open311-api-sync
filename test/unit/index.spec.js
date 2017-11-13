'use strict';


//global dependencies(or imports)
const path = require('path');
const nock = require('nock');
const expect = require('chai').expect;
const faker = require('faker');
const sync = require(path.join(__dirname, '..', '..'));


describe('sync', function () {

  describe('options', function () {

    beforeEach(function () {
      sync.reset();
    });

    it('should be an object', function () {
      expect(sync).to.not.be.null;
      expect(sync).to.be.an('object');
    });

    it('should have default options', function () {
      expect(sync.defaults).to.exist;
      expect(sync.options).to.exist;

      expect(sync.options.timeout).to.exist;
      expect(sync.options.timeout).to.be.equal(600000);

      expect(sync.options.gzip).to.exist;
      expect(sync.options.gzip).to.be.true;

      expect(sync.options.baseUrl).to.be.undefined;
      expect(sync.options.token).to.be.undefined;

      expect(sync.options.uri).to.exist;
      expect(sync.options.uri).to.be.equal('/servicerequests');

    });

    it('should be able to set baseUrl options', function () {

      //base url
      const baseUrl = faker.internet.url();
      sync.baseUrl = baseUrl;

      //assert
      expect(sync.baseUrl).to.exist;
      expect(sync.baseUrl).to.be.equal(baseUrl);

      expect(sync.options.baseUrl).to.exist;
      expect(sync.options.baseUrl).to.be.equal(baseUrl);

    });

    it('should be able to set authorization token options', function () {

      //token
      const token = faker.random.uuid();
      sync.token = token;

      //assert
      expect(sync.token).to.exist;
      expect(sync.token).to.be.equal(token);

      expect(sync.options.token).to.exist;
      expect(sync.options.token).to.be.equal(token);

    });

  });


  describe('post', function () {

    beforeEach(function () {
      sync.reset();
    });

    it('should have post method', function () {
      expect(sync.post).to.exist;
      expect(sync.post).to.be.a('function');
      expect(sync.post.length).to.be.equal(2);
    });

    it('should throw Missing Server Base URL if none defined', function (
      done) {
      const data = {};

      sync.post(data, function (error) {
        expect(error).to.exist;
        expect(error.message).to.be.equal(
          'Missing Server Base URL');
        done();
      });

    });


    it('should throw Missing API Token if none defined', function (done) {
      const data = {};

      sync.baseUrl = faker.internet.url();

      sync.post(data, function (error) {
        expect(error).to.exist;
        expect(error.message).to.be.equal('Missing API Token');
        done();
      });

    });


    it('should throw Missing Service Request Data if none defined',
      function (done) {

        sync.baseUrl = faker.internet.url();
        sync.token = faker.random.uuid();

        sync.post(function (error) {
          expect(error).to.exist;
          expect(error.message)
            .to.be.equal('Missing Service Request Data');
          done();
        });

      });

  });


  describe('post#success', function () {

    const baseUrl = faker.internet.url();
    const token = faker.random.uuid();
    const data = faker.helpers.userCard();

    sync.baseUrl = baseUrl;
    sync.token = token;

    beforeEach(function () {
      nock(sync.baseUrl).post(sync.uri).reply(201, data);
    });

    it('should be able to post successfully', function (done) {

      sync.post(data, function (error, response) {
        expect(error).to.not.exist;
        expect(response).to.exist;
        expect(response).to.be.eql(data);
        done(error, response);
      });

    });

  });


  describe('post#error', function () {

    const baseUrl = faker.internet.url();
    const token = faker.random.uuid();
    const data = faker.helpers.userCard();

    sync.baseUrl = baseUrl;
    sync.token = token;

    beforeEach(function () {
      nock(sync.baseUrl).post(sync.uri).reply(500, {});
    });

    it('should be able to handle post error', function (done) {

      sync.post(data, function (error, response) {

        expect(error).to.exist;
        expect(error.status).to.be.equal(500);
        expect(response).to.not.exist;

        done();

      });

    });

  });

});