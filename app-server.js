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
            console.log('inside forEach: ', active_interface.netmask);
        }
    })

             console.log('outside foreach: ', active_interface);
    
    
    var running = false;// determination variable

    var pcap_session = App.pcap.createSession('en0');// pcap listen server
    var runningCount = 0;
    var testcount = 0;
    // pcap socket
    pcap_session.on('packet', function(raw_packet){
        
        //testing loop run code oncei
        if(testcount == 0){
            console.log('inside packet', active_interface.netmask);
            testcount = 1;
        }

        if(!running) return false;
        
        if(runningCount == 0){
            console.log('inside running', active_interface.netmask);
            runningCount = 1;
        }
        
        var packet = App.pcap.decode.packet(raw_packet);
        socket.emit('buttonPress', packet);

        var subnet = packet_config.localDevice(active_interface, packet);
        console.log(subnet);
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
