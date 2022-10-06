'use strict';

const { io } = require('socket.io-client');

const socket = io('http://localhost:3002/caps');

class MessageClient {
  // queueId is going to be whatever business is fed to it
  constructor (queueId){
    this.queueId = queueId;
    this.socket = io(socket);
    this.socket.emit('JOIN', queueId);
    this.socket.on('JOIN', (id) => {
      console.log('Joined Client Queue', id);
    });
  }

  publish(event, payload){
    this.socket.emit(event, {...payload, queueId: this.queueId});
  }

  subscribe(event, callback){
    this.socket.on(event, callback);
  }
}

module.exports = MessageClient;
