'use strict';
const { io } = require('socket.io-client');

const socket = io('http://localhost:3002/caps');

const MessageClient = require('../lib/messageClient');

const driver = new MessageClient('XYZ Trucking Company');

const Chance = require('chance');
const chance = new Chance();

// driver.publish('GETALL', {queueId: 'messageId'});
// socket.emit('GETALL', {queueId: 'messageId'});

driver.subscribe('PICKUP', (payload) => {
// socket.on('PICKUP', (payload) => {
  console.log('Driver payload', payload);
  console.log('Pickup Recieved');
  driver.publish('RECEIVED', payload);
  // socket.on('RECEIVED', payload);
});

// setInterval(() => {
//   const order = {
//     store: 'Test Driver',
//     messageId: chance.guid({ version: 3 }),
//     name: chance.name(),
//     address: chance.address(),
//   };

//   driver.publish('PICKUP', order);
//   console.log('PICKUP NEW ORDER');
// }, 3000);

//   setInterval(() => {
//     console.log(`DRIVER: Picked up ${payload.messageId}`);
//   }, 3000);
//   driver.publish('TRANSIT', payload);

//   setInterval(() => {
//     console.log(`DRIVER: Delivered ${payload.messageId}`);
//   });
//   driver.publish('DELIVERY', payload);
// }, 3000);


