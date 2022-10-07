'use strict';

const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;
const Queue = require('./lib/queue');

const Chance = require('chance');
const chance = new Chance();

const server = new Server(PORT);
const caps = server.of('/caps');
const messageQueue = new Queue();


caps.on('connection', (socket) => {
  console.log('SERVER Connected to the CAPS namespace', socket.id);

  // Log the event
  socket.onAny((event, payload) => {
    const date = new Date();
    const time = date.toTimeString();
    console.log('EVENT', { event, time, payload });
  });

  // __JOIN_THE RIGHT QUEUE______
  socket.on('JOIN', (queueId) => {
    socket.join(queueId);
    socket.emit('JOIN', queueId);
    console.log('You have joined the room QueueId', queueId);
  });

  // PICKUP_______
  socket.on('PICKUP', (payload) => {
    console.log('Server payload', payload);
    queueHandler(payload);
    let data = dataPacket(payload);
    console.log('=======================', data);
    console.log(socket.id);
    console.log('*************************');
    console.log(caps.id);

    caps.emit('PICKUP', data);
  });

  // // IN-TRANSIT________________________________
  socket.on('TRANSIT', (payload) => {
    queueHandler(payload);
    let data = dataPacket(payload);
    caps.emit('TRANSIT', data);
  });

  // // DELIVERED_________________________________
  socket.on('DELIVERY', (payload) => {
    queueHandler(payload);
    let data = dataPacket(payload);
    caps.emit('DELIVERY', data);
  });

  // // RECEIVED message and delete by messageId____________
  socket.on('RECEIVED', (payload) => {
    console.log('Messages gotten here please?');
    let currentQueue = messageQueue.read(payload.queueId);
    if (!currentQueue) {
      throw new Error('no queue created');
    }
    let message = currentQueue.remove(payload.messageId);

    socket.to(payload.queueId).emit('RECEIVED', message);
  });

  // // GETALL
  socket.on('GETALL', (queueId) => {
    // console.log('Retrieving jobs');
    let currentQueue = messageQueue.read(queueId);
    if (currentQueue && currentQueue.data) {
      Object.keys(currentQueue.data).forEach(messageId => {
        // socket.emit might need to be caps.emit
        socket.emit(currentQueue.read(messageId));
      });
    }
  });


});

function queueHandler(payload) {
  let currentQueue = messageQueue.read(payload.queueID);
  if (!currentQueue) {
    let queueKey = messageQueue.store(payload.queueID, new Queue());
    currentQueue = messageQueue.read(queueKey);
  }
  currentQueue.store(payload.messageId, payload);
}

function dataPacket(payload) {
  let data = {
    messageId: payload.messageId,
    payload,
  };
  return data;
}

// server.on('connection', (socket) => {
//   console.log('Socket connected to event server', socket.id);
// });

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
