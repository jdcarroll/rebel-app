require('./config/app-config.js');

//setup jade template engine
App.app.set('views', './public/views');
App.app.set('view engine', 'jade');

//configure bower and public directories
App.app.use(App.bowerDir);
App.app.use(App.publicDir);

App.app.get('/', function(req, res){
    res.render('index', {title: 'Rebel ISP Monitor'});
});

App.start();
