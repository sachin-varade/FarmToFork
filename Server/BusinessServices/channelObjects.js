'use strict';

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);

// setup the fabric network
var abattoirchannel = fabric_client.newChannel('abattoirchannel');
var processorchannel = fabric_client.newChannel('processorchannel');
var ikeachannel = fabric_client.newChannel('ikeachannel');

var abattoirPeer = fabric_client.newPeer('grpc://localhost:7051');
var logisticPeer = fabric_client.newPeer('grpc://localhost:8051');
var processorPeer = fabric_client.newPeer('grpc://localhost:9051');
var ikeaPeer = fabric_client.newPeer('grpc://localhost:10051');

var peers = {
    abattoirPeer: abattoirPeer,
    logisticPeer: logisticPeer,
    processorPeer: processorPeer,
    ikeaPeer: ikeaPeer
}

var abattoirEventHubPeer = fabric_client.newPeer('grpc://localhost:7051');
var logisticEventHubPeer = fabric_client.newPeer('grpc://localhost:8051');
var processorEventHubPeer = fabric_client.newPeer('grpc://localhost:9051');
var ikeaEventHubPeer = fabric_client.newPeer('grpc://localhost:10051');

var eventHubPeers={
    abattoirEventHubPeer: abattoirEventHubPeer,
    logisticEventHubPeer: logisticEventHubPeer,
    processorEventHubPeer: processorEventHubPeer,
    ikeaEventHubPeer: ikeaEventHubPeer
}

abattoirchannel.addPeer(abattoirPeer);
processorchannel.addPeer(processorPeer);
ikeachannel.addPeer(ikeaPeer);

var orderer = fabric_client.newOrderer('grpc://localhost:7050')
abattoirchannel.addOrderer(orderer);
processorchannel.addOrderer(orderer);
ikeachannel.addOrderer(orderer);

Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);
}).catch((err) => {
	throw err;
});

exports.fabric_client = fabric_client;
exports.abattoirchannel = abattoirchannel;
exports.processorchannel = processorchannel;
exports.ikeachannel = ikeachannel;
exports.peers = peers;
exports.eventHubPeers = eventHubPeers;
exports.orderer = orderer;