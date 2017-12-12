//contains generic functions unrelated to a specific component
var rp = require('request-promise-native');
var bcrypt = require('bcrypt');




/**
 * Generates a pseudo-random alphanumeric string of the specified length
 * (default 5)
 * @see {@link http://fiznool.com/blog/2014/11/16/short-id-generation-in-javascript/}
 * @param {Number} length - the length of the random code
 * @return {String} - the random code
 */
function createShortCode(length = 5) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return str;
}



function createHash(string){
  return new Promise((resolve, reject) => {
  const saltRounds = 10;
  bcrypt.hash(string, saltRounds, function(err, hash) {
    if(err){
      reject(err)
    }
    resolve(hash)
  })
});
}

function compareHash(string1,string2){
  return new Promise((resolve, reject) => {
    try{

    bcrypt.compare(string1,string2, (err, res)=> {
      if(res){
        //console.log('compareHash: resolve')
        resolve(200)
      } else {
        //console.log('compareHash: reject as not correct hash')
        reject(400)
      }
    })
  }catch(e){
    //console.log('compareHash: reject for error')
    resolve(500)
  }

  });


}


//make a simple http request (without a body), uses promises
function makeURIRequest(uri) {
  return new Promise((resolve, reject) => {
    console.log('make http get to ' + uri + ' with:')
    var options = {
      method: 'get',
      uri: uri
    };
    rp(options)
      .then(function(response) {
        var responseData = {};
        responseData.error = null
        responseData.statusCode = 200
        responseData.body = response
        resolve(responseData);
      })
      .catch(function(response) {
        var responseData = {};
        responseData.error = response.error
        responseData.statusCode = response.statusCode
        responseData.body = response.body
        reject(responseData);
      });
  })
}

//make an http request (with a body), uses promises
function makeURIRequestWithBody(uri, method, data) {
  return new Promise((resolve, reject) => {
    var options = {
      method: method,
      uri: uri,
      body: data,
      json: true
    };

    rp(options)
      .then(function(response) {
        var responseData = {};
        responseData.error = null
        responseData.statusCode = 200
        responseData.body = response
        resolve(responseData);
      })
      .catch(function(response) {
        var responseData = {};
        responseData.error = response.error
        responseData.statusCode = response.statusCode
        responseData.body = response.body
        reject(responseData);
      });

  })

}

//create a UUID
function createGUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

module.exports = {
  createHash,
  compareHash,
  createShortCode,
  createGUID: createGUID,
  makeURIRequest: makeURIRequest,
  makeURIRequestWithBody: makeURIRequestWithBody



}
