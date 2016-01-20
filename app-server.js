require('./server/config/app-config.js');

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
    console.log('connected')
    var running = false;// determination variable

    var pcap_session = App.pcap.createSession('en0');// pcap listen server
    
    // pcap socket
    pcap_session.on('packet', function(raw_packet){
        if(!running) return false;
        var packet = App.pcap.decode.packet(raw_packet);
        socket.emit('buttonPress', packet);
        App.db.packets.insert(packet)
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
