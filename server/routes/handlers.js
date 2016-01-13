require('../config/app-config.js'); 
module.exports = {
    dashboard: function(req, res) {
       res.render('index', {title: 'Rebel ISP Monitor'});
     },

}
