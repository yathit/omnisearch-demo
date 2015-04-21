/**
 * Created by kyawtun on 21/4/15.
 */


// parameter pass to client.
var token = '1d19893384cf4279b63a67505473c4a9';
var redirectUri = 'http://localhost:3000/';
var params = ['client_id=' + token, 'redirect_uri=' + redirectUri, 'response_type=code'];
var auth_url = 'https://api.instagram.com/oauth/authorize/';
auth_url += '?' + params.join('&');

if (Meteor.isClient) {

  if (location.search.indexOf('code=') == 1) {

  }

  Meteor.startup(function () {
    var btn = document.getElementById('authorize');
    btn.href = auth_url;

    var code = location.search.substr(6);
    if (code) {
      Meteor.call('fetchAcessToken', code, function(err, resp) {
        var el = document.getElementById('message');
        if (!err) {
          el.textContent = 'Thanks ' + resp.user.full_name + '! access_token: ' + resp.access_token;
        } else {
          el.textContent = String(err);
        }
      });
    }
  });
}

if (Meteor.isServer) {
  var keyStore = new Mongo.Collection("key-store");

  Meteor.methods({
    fetchAcessToken: function(code) {
      var result = HTTP.post('https://api.instagram.com/oauth/access_token', {params: {
        'client_id': token,
        'client_secret': 'ca1f70a5027c461285340095bee9849b',
        'grant_type': 'authorization_code',
        'redirect_uri': redirectUri,
        'code': code
      }});
      console.log(result);
      var data = result.data;
      if (data.access_token) {
        data.source = 'instegram';
        keyStore.insert(data);
        return data;
      } else {
        throw new Error(JSON.stringify(data));
      }
    }
  })
}
