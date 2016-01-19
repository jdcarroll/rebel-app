var nmap = require('libnmap'),
    os   = require('os');

module.exports = function(){
    var _activeInterface = function(){

        var interfaces = os.networkInterfaces();

        for (var i = 0, len = interfaces.en0.length; i < len; i++ ){
            if (interfaces.en0[i].family == 'IPv4'){
                 var use = interfaces.en0[i];
            }
        }
         return use
    }

    var _setSubnet = function(netObj){
        var range = {}
        if (netObj.netmask == '255.255.255.0'){
            var addr = netObj.address.split(".");
            addr.pop();
            var str = addr[0] + "." + addr[1] + "." + addr[2] + ".0/"  
            str.concat(".0/");
            var deviceRange = "25"
            range = {
                deviceRange: deviceRange,
                search : str + deviceRange
            };
        }
        return range;
    }

    var opts = {
        range: [range.search]
    }

    var _discover = function(){
        nmap.discover(function(err, report){
            if (err) throw new Error(err);

            return report;
        })
    }
    var _scan = function(ipaddr){
        nmap.scan(ipaddr, function(err, report){
            if (err) throw new Error(err);

            return report;
        })           
    }
    return {
        activeInterface : _activeInterface,
        setSubnet : _setSubnet,
        discover: _discover
    }
}
