'use strict';
// const { io } = require('socket.io-client');

// const socket = io('http://localhost:3002/caps');


const MessageClient = require('../lib/messageClient');
const messenger = new MessageClient('ABC Flower Company');


const Chance = require('chance');
const chance = new Chance();

messenger.subscribe('DELIVERED', (payload) => {
  console.log(`confirmed ${payload} received.`);

  messenger.publish('RECEIVED', payload);
});

setInterval(() => {
  const order = {
    store: 'ABC Flower Company',
    messageId: chance.guid({ version: 3 }),
    name: chance.name(),
    address: chance.address(),
  };

  messenger.publish('PICKUP', order);
  console.log('PICKUP NEW ORDER');
}, 3000);


// socket.on('disconnect', () => {
  //   console.log('Your connection has been disconnected!', socket.id);
  // });


  // On connection, this will diosplay the socket id in the vendor console
  // console.log(socket.id);

  // socket.emit('JOIN', 'caps');

  // console.log('Join from vendor');

  // ______________
  // socket.on('connect', () => {














// });

