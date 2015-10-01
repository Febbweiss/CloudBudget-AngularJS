var http = require('http');
var path = require('path');

var express = require('express');

var router = express();
var server = http.createServer(router);

router.get('*', function(req, res, next) {
  var dotIndex = req.path.lastIndexOf('.'),
      extension = dotIndex === - 1 ? '' : req.path.substr(dotIndex);
      
      if( ['.js','.css','.html', 
        '.woff', '.woff2', '.ttf', '.svg', '.eot', '.otf'].indexOf(extension) > -1 ) {
        next();
      } else {
        res.sendfile('./public/index.html');
      }
});
router.use(express.static(path.resolve(__dirname, 'public')));

process.title = 'CloudBudget-AngularJS';

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("CloudBudget-AngularsJS server listening at", addr.address + ":" + addr.port);
});
