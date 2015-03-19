var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
  res.sendfile('./dist/index.html');
})

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
})
