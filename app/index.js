const cfg = require('./config');
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');

const StringDecoder = require('string_decoder').StringDecoder;

const httpServer = http.createServer(function (req,res){
    unifiedServer(req,res);
});

httpServer.listen(cfg.port, function(){
    console.log('Listening in ' + cfg.envName + ' on ' + cfg.port + '...')
});

const httpsServerOptions = {
    key : fs.readFileSync('./app/https/key.pem'),
    cert : fs.readFileSync('./app/https/cert.pem')
};


const httpsServer = https.createServer(httpsServerOptions, function (req,res){
    unifiedServer(req,res);
});

httpsServer.listen(cfg.sslPort, function(){
    console.log('Listening in ' + cfg.envName + ' on ' + cfg.port + '...')
});

var unifiedServer = function (req,res){
    //parse Url
    var parsedUrl = url.parse(req.url, true);

    //get path
    var path = parsedUrl.pathname;
    
    //clean path
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    
    console.log('path: ', trimmedPath);
    
    //get method
    var method = req.method.toUpperCase();

    console.log('method: ', method);

    //get query string
    var queryString = parsedUrl.query;

    console.log('queryString: ', queryString);

    //get headers
    var headers = req.headers;

    console.log('headers: ', headers);

    //get payload
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function(){
        buffer += decoder.end();
        console.log('payload: ', buffer);

        var myHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        var data = {
            'headers': headers,
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'method': method,
            'payload': buffer
        }

        myHandler(data, function(statusCode, payload){
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            var payloadString = JSON.stringify(typeof(payload) === 'object' ? payload : {});
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });


        
    })
};

//handlers
var handlers = {};

handlers.getBanana = function(data, callback){
    callback(406,{'banana' : 'here\'s a banana' });
};

handlers.notFound = function(data, callback){
    callback(404);
};

//request router
var router = {
    'getBanana' : handlers.getBanana
};