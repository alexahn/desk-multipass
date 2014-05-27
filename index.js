var crypto = require('crypto');

/**
 * Documentation: http://dev.desk.com/guides/sso/
 */
 
var Desk = function(siteKey, apiKey) {
  var self = this;

  self.create = function (params, callback) {
    var salt, key, iv, data;
    if (!params.uid) return callback(new Error("Missing 'uid' field"));
    if (!params.expires) return callback(new Error("Missing 'expires' field"));
    if (!params.customer_email) return callback(new Error("Missing 'customer_email' field"));
    if (!params.customer_name) return callback(new Error("Missing 'customer_name' field"));
    crypto.randomBytes(16, function (err, random) {
      var cipher, multipass, signature;
      if (err) return callback(err);
      iv = random;
      salt = apiKey + siteKey;
      key = crypto.createHash('sha1')
        .update(salt)
        .digest('binary')
        .substring(0, 16);
      data = new Buffer(JSON.stringify(params));
      cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
      multipass = Buffer.concat([iv, cipher.update(data, 'binary'), cipher.final()]);
      multipass = multipass.toString('base64');
      signature = crypto.createHmac('sha1', apiKey)
        .update(multipass)
        .digest('base64');
      callback(null, multipass, signature);
    });
    
  };

};

module.exports = Desk;
