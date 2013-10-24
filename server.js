// var express = require('express'),
//     http = require('http'),
//     users = require('./api_routes/users'),
//     events = require('./api_routes/events');

// http.createServer(app).listen(app.get('port'), function(){
//   console.log("Express server listening on port " + app.get('port'));
// });


// var app = express();

var express = require('express'),
    app = express();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = require('./api_routes/users'),
    events = require('./api_routes/events');





var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, api_token, user_token');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(allowCrossDomain);
    app.use('/www', express.static(__dirname + '/www'));
    app.use('/src', express.static(__dirname + '/src'));
    app.use('/vendor', express.static(__dirname + '/vendor'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.set('views', __dirname + '/www');
    app.engine('html', require('ejs').renderFile);
});

app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/api/users/create/', users.create);
app.post('/api/users/login/', users.login);
app.get('/api/users/get_user/:user_id', users.getUser);

app.post('/api/events/find_event/', events.findEvent);
app.get('/api/events/get_event/:name', events.getEvent);
app.get('/api/events/vote_girl/:event_id/:name/:user_id', events.voteGirl);
app.get('/api/events/vote_boy/:event_id/:name/:user_id', events.voteBoy);
app.post('/api/events/create', events.createEvent);
app.get('/api/events/socket/:event_name', events.socket);

app.get('/:anything', function (req, res) {
    res.render('index.html');
});

viewed_events = {};
console.log(viewed_events);
io.sockets.on('connection', function (client) {
    client.emit('connected');
    client.on('event_name', function (data) {
        if(data.event_name in viewed_events) {
            viewed_events[data.event_name].push(client.id);
        } else {
            viewed_events[data.event_name] = [];
            viewed_events[data.event_name].push(client.id);
        }
        console.log(viewed_events);
    });
    client.on('disconnect', function() {
        var client_id = client.id;
        for (key in viewed_events) {
            if (viewed_events[key].indexOf(client_id) > -1) {
                var client_index = viewed_events[key].indexOf(client_id);
                viewed_events[key].splice(client_index, client_index + 1);
            }
        }
        console.log(viewed_events);
    }); 

})


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
