
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , index = require('./routes/index')
  , topic = require('./routes/topic')
  , http = require('http')
  , path = require('path')

var app = express()

var routes = {}
routes.index = index
routes.topic = topic

app.configure(function(){
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'hjs')
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(path.join(__dirname, 'public')))
})

app.configure('development', function(){
  app.use(express.errorHandler())
})

app.get  ('/', function(req, res) { res.redirect('/topic') })
app.get  ('/topic',     routes.topic.list)
app.get  ('/topic/:id', routes.topic.view)
app.post ('/topic',     routes.topic.create)
app.post ('/topic/:id', routes.topic.reply)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'))
})
