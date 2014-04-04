### Desk.com Multipass SSO module

Simple module for Desk.com's [multipass SSO](http://dev.desk.com/guides/sso/).

#### Install

    npm install desk-multipass

#### Usage (with express)

```js
var url = require('url');
var multipass = new require('desk-multipass')(SITEKEY, APIKEY);

app.get('/desk', function (req, res, next) {
  // check if user is logged in
  multipass.create({
    uid: '1',
    expires: new Date(new Date().getTime() + (1000 * 60)),
    customer_email: 'alex.ahn@test.com',
    customer_name: 'Alex Ahn'
  }, function (err, multipass, signature) {
    var multipassUrlObj, multipassUrl;
    if (err) return next(err);
    multipassUrlObj = {
      protocol: 'http',
      host: 'test.desk.com',
      pathname: '/customer/authentication/multipass/callback',
      query: {
        multipass: multipass,
        signature: signature
      }
    };
    multipassUrl = url.format(multipassUrlObj);
    res.redirect(multipassUrl);
  });
});

```
