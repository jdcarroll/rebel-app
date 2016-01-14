var env         = process.env.NODE_ENV || 'Development'
,   packageJson = require('../../package.json')
,   path        = require('path')
,   express     = require('express')
,   server      = require('http')
,   io          = require('socket.io')()
,   pcap        = require('../../node_pcap')
,   handler     = require('../routes/handlers.js')
,   ioclient   = require('socket.io-client');

console.log('------------------------------------------------');
console.log('---------Loading Rebel ISP Monitoring-----------');
console.log('-------------App Configururation----------------');

global.App = {
    app: express(),
    express: express,
    port: process.env.PORT || 80,
    version: packageJson.version,
    root: path.join(__dirname, '..'),
    handler: handler,
    server: server,
    io: io,
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
            this.started = true
            
            this.app.set('port', this.port)
            this.server = this.server.createServer(this.app)
            this.io = this.io.listen(this.server)
            this.server.listen(this.port)

            this.server.on('error', function(error) {
                console.log(error)
            });
            var server = this.server
            this.server.on('listening', function(){
                var addr = server.address();
                var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
                console.log('Listening on '+ bind)
            })
        }
    }
}

