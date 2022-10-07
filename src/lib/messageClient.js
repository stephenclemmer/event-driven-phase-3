'use strict';

const { io } = require('socket.io-client');

const socket_URL = 'http://localhost:3002/caps';

class MessageClient {
 
  constructor (queueId){
    this.queueId = queueId;
    this.socket = io(socket_URL);
    this.socket.emit('JOIN', (queueId));
    this.socket.on('JOIN', (id) => {
      console.log('Joined Client Room', id);
    });
  }

  publish(event, payload){
    this.socket.emit(event, {...payload, queueId: this.queueId});
  }

  subscribe(event, callback){
    console.log('Subscribe messageClient.js');
    this.socket.on(event, callback);
  }
}

module.exports = MessageClient;
