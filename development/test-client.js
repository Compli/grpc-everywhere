"use strict";

const grpc = require('grpc');

const user = grpc.load('./protos/user.proto').user;
const client = new user.UserService('node:50051', grpc.credentials.createInsecure());

client.getUser({id: 1234}, function(error, response) {
    if (error) {
        console.error(error);
    } else {
        console.log('Response:', response);
    }
});
