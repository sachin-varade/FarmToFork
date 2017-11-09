
channelObjects = require("./BusinessServices/channelObjects.js");
setTimeout(function() {    
    abattoirService = require("./BusinessServices/abattoirService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
}, 2000);

setTimeout(function() {
    abattoirService.createPart();    
}, 5000);


setTimeout(function() {
    //abattoirService.getAllParts();
}, 10000);
