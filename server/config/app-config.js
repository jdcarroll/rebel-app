var env         = process.env.NODE_ENV || 'Development'
,   packageJson = require('../../package.json')
,   path        = require('path')
,   express     = require('express')
,   server      = require('http')
,   io          = require('socket.io')()
,   pcap        = require('../../node_pcap')
,   handler     = require('../routes/handlers.js')
,   ioclient    = require('socket.io-client')
,   mongojs     = require('mongojs')
,   nmap_utils  = require('../../server/config/node_nmap.js')
,   spawn       = require('child_process').spawn
,   packet      = require('../../server/config/packet_test.js')
,   os          = require('os');

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
    os: os,
    io: io,
    spawn: spawn,
    db: mongojs('rebel-app', ['packets', 'bandwidth', 'devices']),
    pcap: pcap,
    packet: packet,
    publicDir: express.static('public'),
    bowerDir: express.static('bower_components'),
    utils: {
        nmap : {
            activeInterface: nmap_utils.activeInterface,
            discover: nmap_utils.discover,
            setSubnet: nmap_utils.setSubnet
        }        
    },
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

