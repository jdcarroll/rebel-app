var os = require('os');

module.exports = function(){

    var __dhost = function(packet){
        
        var dObj = {};

        if (packet.hasOwnProperty(packet.payload.payload.daddr.addr)){ 
            
            dObj.subPayload.addr = true;
            
            console.log("packet.payload.payload.daddr: ", packet.payload.payload.daddr.addr);  
        }
    }

}
