var env         = process.env.NODE_ENV || 'Development'
,   packageJson = require('../package.json')
,   path        = require('path')
,   express     = require('express')
,   server      = require('http')
,   io          = require('socket.io')
,   pcap        = require('../node_pcap');

console.log('------------------------------------------------');
console.log('---------Loading Rebel ISP Monitoring-----------');
console.log('-------------App Configururation----------------');

global.App = {
    app: express(),
    express: express,
    port: process.env.PORT || 4000,
    version: packageJson.version,
    root: path.join(__dirname, '..'),
    server: server.createServer(this.app),
    io: io.listen(this.server),
    pcap: pcap,
    publicDir: express.static('public'),
    bowerDir: express.static('bower_components'),
    appPath: function(path) {
        return this.root + '/' + path
    },
    require: function(path){
        return require(this.appPath(path));
    },
    start: function(){
        if (!this.started){
            this.started = true
            this.app.listen(this.port)
            console.log('app running at http://localhost:' + this.port);
        }
    }
}

