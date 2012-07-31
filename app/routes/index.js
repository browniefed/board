var fs = require('fs')
  , util = require('util')
  , sessions = require('cookie-sessions')
  , twitter = require('ntwitter')
  , pl = require('../lib/pl.js')


// twitter client  https://github.com/AvianFlu/ntwitter
var twit = new twitter({
  consumer_key: config.twitter.consumerkey,
  consumer_secret: config.twitter.consumersecret,
  access_token_key: config.twitter.accesskey,
  access_token_secret: config.twitter.accesssecret
});;


// the web context
function WebContext(req){
  //util.log(util.inspect(req))
  var roles, self = this;
  this.iourl =    "http://" + req.headers.host
  this.title =       "Pie Dashboard"
}

/**
 * Modules/Filters/Middleware for routes below   
*/
function mw(req,res,next){
  if (!("context" in req)){
    req.context = new WebContext(req)
  }
  next()
}

// hook up to socket.io
io.sockets.on('connection', function (socket) {
  // emit initial useless event
  socket.emit('event', { event:"hello", text: 'hello world' });
});

/*
TODO:  connect and listen to HUBOT and send messages to browser
    HUBOT to get hooked up to our IRC

hubot.on("msg",function(data){
  
  if (data.event == "twstream") {
    // lets add a new twitter listener for this search term
    // and restart twitter stream listening
    twitterListener()
  } else {
    // send to browser
    socket.emit('event', { event:"hello", text: 'hello world' });
  }
  
})
*/

var pieTwData = [];

// this is a one time search for history of piepdx data
twit.search('piepdx', {}, function(err, data) {
  //console.log(data);
  pieTwData = data
});
/*
https://github.com/AvianFlu/ntwitter
TODO:  
  - listen to tweet stream 
  - allow hubot messages "twstream beer" to add new searches to tweet stream
function twitterListener(){
  twit.stream('statuses/filter', {'track':"piepdx", locations':'-122.75,36.8,-121.75,37.8,-74,40,-73,41'}, function(stream) {
    stream.on('data', function (data) {
      console.log(data);
    });
  });
}

*/

app.get('/api/tweets', mw, function(req, res) {
  res.contentType('application/json');
  res.send(pieTwData);
});

app.get('/schedule', mw, function(req, res) {
  //res.render("dash", pl.extend(req.context,{}) );
  util.log(util.inspect(req.context))
  res.render("schedule", req.context);
});

app.get('/', mw, function(req, res) {
  //res.render("dash", pl.extend(req.context,{}) );
  util.log(util.inspect(req.context))
  res.render("stream", req.context);
});