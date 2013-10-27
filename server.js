var express = require('express'),
    app = express();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = require('./api_routes/users'),
    events = require('./api_routes/events'),
    Redis = require('redis-node'),
    redisURL = {},
    databaseUrl = "bjoshuanoah:qwert1@paulo.mongohq.com:10021/gender_reveal",
    collections = ["users", "events"],
    db = require("mongojs").connect(databaseUrl, collections);






// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//   COORS                          //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//   Rules & Middleware             //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(allowCrossDomain);
    app.use('/www', express.static(__dirname + '/www'));
    app.use('/src', express.static(__dirname + '/src'));
    app.use('/vendor', express.static(__dirname + '/vendor'));
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.set('views', __dirname + '/www');
    app.engine('html', require('ejs').renderFile);
});



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//   Routing                        //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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
app.get('/api/events/update_gender/:event_name/:gender', events.updateGender);

app.get('/**', function (req, res) {
    res.render('index.html');
});



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//   Redis                          //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

redisURL.port = 14693;
redisURL.hostname = 'pub-redis-14693.us-east-1-3.1.ec2.garantiadata.com';
redisURL.pass = 'Y9R9nx3h1phpVauw';
redis = Redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
redis.auth(redisURL.pass);



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//   Sockets                        //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

io.sockets.on('connection', function (client) {
    client.emit('connected');
    client.on('event_name', function (data) {
        client.event_name = data.event_name;
        var client_id = client.id;
        console.log(client_id);
        redis.sadd('events:' + client.event_name, client_id, function ( err, reply) {
            console.log(err);
            console.log('events:' + client.event_name, reply);
        });
        redis.smembers('events:' + client.event_name, function (err, reply) {
            console.log('events:' + client.event_name, reply);
        });
    });
    client.on('disconnect', function() {
        var client_id = client.id;
        console.log(client_id);
        redis.srem('events:' + client.event_name, client_id);
        redis.smembers('events:' + client.event_name, function (err, reply) {
            console.log('events:' + client.event_name, reply);
        });
    }); 

})


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//   Start App                      //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
