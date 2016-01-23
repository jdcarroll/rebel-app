require('./server/config/app-config.js');
var packet_config  = require('./server/config/packet_test.js');


//setup jade template engine
App.app.set('views', './public/views');
App.app.set('view engine', 'jade');

//configure bower and public directories
App.app.use(App.bowerDir);
App.app.use(App.publicDir);


App.app.get('/', App.handler.dashboard);

App.app.get('/views/templates/:name', function (req, res){ 
    var name = req.params.name;
    res.render('templates/' + name);
});



App.io.on('connection', function(socket){
    var interfaces = App.os.networkInterfaces(),
        active_interface = {};
        
    interfaces.en0.forEach(function(e){
        if(e.family == 'IPv4'){
            socket.emit('connection', e)
            active_interface = e;
        }
    })
    var found_devices = []
    App.db.devices.find(function(err, devices){
        if (err || !devices ) console.log("No Devices found");
        else devices.forEach( function(device){
            found_devices.push(device);
        })
    });
    

    var running = false;// determination variable

    var pcap_session = App.pcap.createSession('en0');// pcap listen server
    var runningCount = 0;
    var testcount = 0;
    // pcap socket
    pcap_session.on('packet', function(raw_packet){
        
        if(!running) return false;
        
        var packet = App.pcap.decode.packet(raw_packet);

        var device_incoming = packet_config.localDevice(active_interface, packet);
        var device = [];
        device_incoming.forEach(function(e){
            
            var split = e.split(',', 4);
            split.forEach(function(e){
                var num = Number(e);
                device.push(num);
            })
        })
       
        found_devices.forEach(function(e){
        
            if(e.ip == device){
            
            } else{
                App.db.devices.insert({'ip': device, "timestamp": new Date()})
            }

        })

        console.log('devices: ',found_devices);

        socket.emit('buttonPress', device);
        console.log(device);

        })
    socket.on('buttonPress', function(data){
        
        if (data == 'on'){
            running = true;
        }else if(data == 'off'){
            running = false;
        }
    })

    socket.on('bandwidth', function(data){
        App.db.bandwidth.insert(data);
    })

});

App.start();
