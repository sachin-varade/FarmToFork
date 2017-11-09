
var enrollAdmin = require('./enrollAdmin.js');
var registerUser = require('./registerUser.js');
var admins = [
                {
                    ca: {url: "http://localhost:7054", name: "ca.org1.example.com"}, 
                    enrollmentID: "farmersadmin", 
                    enrollmentSecret: "adminpw", 
                    mspid: "Org1MSP"
                },
                {
                    ca: {url: "http://localhost:8054", name: "ca.org2.example.com"}, 
                    enrollmentID: "logisticsadmin", 
                    enrollmentSecret: "adminpw", 
                    mspid: "Org2MSP"
                },
                {
                    ca: {url: "http://localhost:9054", name: "ca.org3.example.com"}, 
                    enrollmentID: "processorsadmin", 
                    enrollmentSecret: "adminpw", 
                    mspid: "Org3MSP"
                },
                {
                    ca: {url: "http://localhost:10054", name: "ca.org4.example.com"}, 
                    enrollmentID: "ikeasadmin", 
                    enrollmentSecret: "adminpw", 
                    mspid: "Org4MSP"
                }
             ];

var users = [
                {
                    ca: {url: "http://localhost:7054", name: "ca.org1.example.com"}, 
                    admin: "farmersadmin", 
                    enrollmentID: "farmer1", 
                    affiliation: "org1.department1",
                    mspid: "Org1MSP"
                },
                {
                    ca: {url: "http://localhost:8054", name: "ca.org2.example.com"}, 
                    admin: "logisticsadmin", 
                    enrollmentID: "logistic1", 
                    affiliation: "org2.department1",
                    mspid: "Org2MSP"
                },
                {
                    ca: {url: "http://localhost:9054", name: "ca.org3.example.com"}, 
                    admin: "processorsadmin", 
                    enrollmentID: "processor1", 
                    affiliation: "org3.department1",
                    mspid: "Org3MSP"
                },
                {
                    ca: {url: "http://localhost:10054", name: "ca.org4.example.com"}, 
                    admin: "ikeasadmin", 
                    enrollmentID: "ikea1", 
                    affiliation: "org4.department1",
                    mspid: "Org4MSP"
                }
             ];

console.log("##########################################################");
console.log("############Now We Enroll Admins for each org#############");
console.log("##########################################################");
enrollAllAdmin(0);
function enrollAllAdmin(id){
    enrollAdmin.enrollAdmin(admins[id].ca, 
        admins[id].enrollmentID,
        admins[id].enrollmentSecret,
        admins[id].mspid)
        .then((user) => {
            if(id<3){
                enrollAllAdmin(id+1);
            }
            else{
                console.log("##########################################################");
                console.log("#########All Admins enrolled successfully...!!!!##########");
                console.log("##########################################################");
                console.log("############Now We Register Users for each org############");
                console.log("##########################################################");
                registerAllUsers(0);
            }
        }).catch((err) => {
            console.error('Failed to enroll admin: ' + err);
        });
}


function registerAllUsers(id){
    registerUser.registerUser(users[id].ca, 
        users[id].admin, 
        users[id].enrollmentID,
        users[id].affiliation,
        users[id].mspid)
        .then((user) => {
            if(id<3){
                registerAllUsers(id+1);
            }
            else{
                console.log("##########################################################");
                console.log("##########All Users enrolled successfully...!!!!##########");
                console.log("##########################################################");
            }
        }).catch((err) => {
            console.error('Failed to enroll admin: ' + err);
        });
}

    