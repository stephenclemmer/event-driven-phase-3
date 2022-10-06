'use strict';

const { io } = require('socket.io-client');

const MessageClient = require('../lib/messageClient');

const messenger = new MessageClient('ABC Flower Company');

const socket = io('http://localhost:3002/caps');

const Chance = require('chance');

const chance = new Chance();

socket.emit('JOIN', 'caps');

socket.on('connect', () => {
  console.log(socket.id);

  messenger.subscribe('RECEIVED', (payload) => {
    console.log(`confirmed ${payload} received.`)
  });

  setInterval(() => {
    const order = {
      store: 'ABC Flower Company',
      orderId: chance.guid({ version: 3 }),
      name: chance.name(),
      address: chance.address(),
    };
    console.log('----Call for PICKUP----');

    messenger.publish('PICKUP', {order});

    // socket.emit('PICKUP', {order});
  }, 9000);

});

socket.on('disconnect', () => {
  console.log('Your connection has been disconnected!', socket.id);
});
