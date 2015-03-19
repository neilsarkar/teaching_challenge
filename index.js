var express = require('express'),
    request = require('request'),
    app = express();

app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/public'));

app.get('/imageproxy', function(req, res) {
  console.log(req.query.cool);
  request(req.query.cool).pipe(res);
})

app.get('*', function(req, res) {

  res.sendfile('./dist/index.html');
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
})
