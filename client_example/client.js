"use strict";

const grpc = require('grpc');

const user = grpc.load('./protos/user.proto').user;
const client = new user.UserService('localhost:50051', grpc.credentials.createInsecure());

client.getUser({id: 1234}, function(error, response) {
    if (error) {
        console.log(error.metadata.get('error'));
        console.log(error.metadata.get('code'));
        console.error('Error: ' + error);
    } else {
        console.log('Response:', response);
    }
});
