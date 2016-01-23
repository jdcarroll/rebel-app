    require('../../server/config/app-config.js');
    var os = require('os');

    var __netmask = function(active_inerface){ // the purpose of this function is to determine the subnet class of the current testable evironment
    // if we pass an active inteface object that looks like this
    // Example: 
    //  active interface = {
    //      address : 'ipaddress',
    //      netmask : 'netmask',
    //      family : 'IPv4',
    //      mac : 'mac address',
    //      intenal : false
    //  }
    //  this function returns the subnet pattern that we need to match when searching packets
       var aI = active_inerface,
           pattern = '';
       
       if(aI.netmask == '255.255.255.0'){
           aI.address.pop();
           pattern = aI.address;
       }else if(aI.netmask == '255.255.192.0'){
           aI.address.pop();
           aI.address.pop();
           pattern = aI.address;
       }else if(aI.netmask == '255.255.0.0'){
           aI.address.pop();
           aI.address.pop();
           pattern = aI.address;
       }else if(aI.netmask == '255.0.0.0'){
           aI.address.pop();
           aI.address.pop();
           aI.address.pop();
           pattern = aI.address;
       }

       return pattern;
    }

    var __localDevice = function(active_inerface, packet){
     // this function is going to do it all this will be the out facing function calling all other functions from
     // inside it.  the steps that this function follows are
     // 1) takes the active interface and a packet as arguement
     // 2) then runs the netmask function to find the search pattern to match in the packet object
     // 3) as soon as it finds the ip match it returns that as a string
        
       var subnet = __netmask(active_inerface); // calling netmask function

        var addressArray = __addresses(packet);
        var subStr = subnet.toString();
        var str = packet.payload.dhost.addr.toString();
        var numberedArray= [];
        
        if(str.includes(subStr)){
            array = str.split(",")
            array.forEach(function(e){
                var n = Number(e)
                numberedArray.push(n);
            })

        }
    }

    //discover function
    //1) takes an ip address and checks the database for that IP
    //      if it exsists
    //          update timestamp
    //      else
    //          enter ip into db
    var __discover = function(ipArg){
       // data = App.db.devices.find({ 'ip' : ip })
       //if ( data.length > 0 ){
       //}else{
        var testing = ipArg; 
        App.db.devices.insert({'ip': testing, 'timestamp' : new Date()  });
         console.log("inserted data", testing);
       // }
    }

    // scan function
    // 1) go through the list of ips in db and run an nmap scan on them
    // for each function on returned array
    // limit 10 at a time
    
    // check timestamp function
    // 1) loop through ips check if timestamp is older then 10 mins
    // then ping device 
    //  if no response mark device down

    var __addresses = function(packet){
        var array = [];

        if(packet.payload.dhost){
            var host = packet.payload.dhost.addr;
            array.push(host)
        }else{
            array.push('blah');
        }
        if(packet.payload.payload.daddr){
            var address = packet.payload.payload.daddr.addr; 
            array.push(address)
        }else{
            array.push('blah');
        }
        if(packet.payload.payload.saddr){
            var address = packet.payload.payload.saddr.addr;
            array.push(address);
        }else {
            array.push('blah');
        }
        if(packet.payload.shost){
            var host = packet.payload.shost.addr;
            array.push(host);
        }else {
            array.push('blah');
        }

        return array;
    }


a = {
    address: [10, 2, 0, 27],
    netmask: '255.255.255.0'
}

packet = {
    payload: {
        dhost: {
            addr: [10, 2, 0, 45]
        },
        payload:{
            daddr: {
                addr: [192, 168, 0, 24]
            },
            saddr: {
                addr: [192, 168, 24, 0]
            }
        },
        shost: {
            addr: [10, 2, 35, 0]
        }
    }
}

    var active = os.networkInterfaces().en0[1];
__discover(a.address);

//console.log(packet.payload.dhost);
console.log(active);
__localDevice(active, packet);



