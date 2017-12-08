'use strict';


/**
 * @module open311-api-sync
 * @name open311-api-sync
 * @description open311 downstream and upstream api sync
 * @author lally elias <lallyelias87@gmail.com>
 * @version 0.1.0
 * @since 0.1.0
 * @public
 */


//global dependencies(or imports)
const _ = require('lodash');
const request = require('request');


//local constants
const SERVICE_REQUEST_URI = '/servicerequests';


/**
 * @name defaults
 * @description default options
 * @type {Object}
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.defaults = {

  /**
   * @name timeout
   * @description number of milliseconds to wait for a server to send
   *              response headers (and start the response body) before
   *              aborting the request
   * @type {Number}
   * @since 0.1.0
   * @version 0.1.0
   */
  timeout: 600000,

  /**
   * @name gzip
   * @description add an Accept-Encoding header to request compressed content
   *              encodings from the server (if not already present) and
   *              decode supported content encodings in the response
   * @type {Boolean}
   * @since 0.1.0
   * @version 0.1.0
   */
  gzip: true,


  /**
   * @name baseUrl
   * @description base url of the server which receive service request(or issue)
   * @type {String}
   * @since 0.1.0
   * @version 0.1.0
   */
  baseUrl: undefined,


  /**
   * @name uri
   * @description service request(or issue) uri
   * @type {String}
   * @since 0.1.0
   * @version 0.1.0
   */
  uri: SERVICE_REQUEST_URI,


  /**
   * @name token
   * @description authorization token of the server which receive
   *              service request(or issue)
   * @type {String}
   * @since 0.1.0
   * @version 0.1.0
   */
  token: undefined

};


/**
 * @name options
 * @description options
 * @type {Object}
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
exports.options = exports.defaults;


//define magic setter & getter on options
_.forEach(_.keys(exports.options), function (option) {
  Object.defineProperty(exports, option, {
    set: function (value) {
      exports.options = _.merge({}, exports.options);
      exports.options[option] = value;
    },
    get: function () {
      return exports.options[option];
    }
  });
});


/**
 * @name reset
 * @description reset request options
 * @type {Function}
 * @since 0.1.0
 * @version 0.1.0
 */
exports.reset = function () {
  exports.options = exports.defaults;
};



/**
 * @name preflight
 * @description perform pre-logics i.e validations and pre-condtions
 *              checking for successful syncing
 * @param  {Object} data valid service request data or changes
 * @done {Function} a callback to invoke on success or failure
 * @type {Function}
 * @since 0.2.0
 * @version 0.1.0
 */
exports.preflight = function (data, done) {

  //normalize arguments
  if (_.isFunction(data)) {
    done = data;
    data = {};
  }

  //obtain options
  const options = _.merge({}, exports.options);

  //ensure server base url
  if (_.isEmpty(options.baseUrl)) {
    let error = new Error('Missing Server Base URL');
    return done(error);
  }

  //ensure service request uri
  if (_.isEmpty(options.uri)) {
    let error = new Error('Missing Service Request URI');
    return done(error);
  }

  //ensure API token
  if (_.isEmpty(options.token)) {
    let error = new Error('Missing API Token');
    return done(error);
  }

  //ensure data
  data =
    (data && _.isFunction(data.toObject) ? data.toObject : data);
  if (_.isEmpty(data)) {
    let error = new Error('Missing Service Request Data');
    return done(error);
  }

  //ensure default request headers
  options.headers = {
    'Authorization': 'Bearer ' + options.token,
    'Accept': 'application/json',
  };

  //continue
  return done(null, options);

};


/**
 * @name post
 * @param  {Object} data valid service request
 * @done {Function} a callback to invoke on success or failure
 * @type {Function}
 * @since 0.1.0
 * @version 0.1.0
 */
exports.post = function (data, done) {

  //run request pre-flight
  exports.preflight(data, function (error, options) { //start pre-flight

    //back-off in case of error during pre-flight
    if (error) {
      return done(error);
    }

    //continue with request

    //prepare post downstream http request options
    const requestOptions = {
      baseUrl: options.baseUrl,
      uri: options.uri,
      headers: options.headers,
      gzip: options.gzip,
      json: data //this will set content type to application/json
    };

    //post service request
    request
      .post(requestOptions, function (error, response, body) {

        //handle error
        if (error) {
          return done(error);
        }

        //check if response succeed
        const isSuccess =
          (response &&
            (response.statusCode === 201 ||
              response.statusCode === 200));

        //handle error response
        if (!isSuccess) {
          error = new Error('Fail to Sync Service Request');
          error.status = response.statusCode;
          return done(error);
        }

        //handle success response
        return done(null, body);

      });


  }); //end preflight

};


/**
 * @name post
 * @param  {Object} data valid service request changes
 * @done {Function} a callback to invoke on success or failure
 * @type {Function}
 * @since 0.2.0
 * @version 0.1.0
 */
exports.patch = function (data, done) {

  //run request pre-flight
  exports.preflight(data, function (error, options) { //start pre-flight

    //back-off in case of error during pre-flight
    if (error) {
      return done(error);
    }

    //continue with request

    //prepare patch downstream http request options
    const requestOptions = {
      baseUrl: options.baseUrl,
      uri: options.uri,
      headers: options.headers,
      gzip: options.gzip,
      json: data //this will set content type to application/json
    };

    //patch service request
    request
      .patch(requestOptions, function (error, response, body) {

        //handle error
        if (error) {
          return done(error, response);
        }

        //check if response succeed
        const isSuccess =
          (response &&
            (response.statusCode === 201 ||
              response.statusCode === 200));

        //handle error response
        if (!isSuccess) {
          error = new Error('Fail to Sync Service Request');
          error.status = response.statusCode;
          return done(error, response);
        }

        //handle success response
        return done(null, body, response);

      });

  }); //end preflight

};
