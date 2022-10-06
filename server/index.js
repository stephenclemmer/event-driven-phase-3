'use strict';

const { Server } = require('socket.io');
const PORT = process.env.PORT || 3002;
const Queue = require('./lib/queue');

// instance of a listening event server at http://localhost:3002/caps
const server = new Server(PORT);

// namespace
const caps = server.of('/caps');

// driver queue
const driverQueue = new Queue();

server.on('connection', (socket) => {
  console.log('Socket connected to event server', socket.id);

});

caps.on('connection', (socket) => {
  console.log('Connected to the CAPS namespace', socket.id);

  socket.on('JOIN', (room) => {
    console.log(`You have entered the ${room} room`);
  });

  // 2:59 ___________JOIN_______________________________________
  socket.on('JOIN', (queueId) => {
    socket.join(queueId);
    // confirmation that we have joined the room
    socket.emit('JOIN', queueId);
  });

  // CALL FOR PICKUP______________________________________
  socket.on('PICKUP', (payload) => {
    logEvent('PICKUP', payload);

    // 2:33 check the payload and queueID for accuracy
    let currentQueue = driverQueue.read(payload.store);
    if (!currentQueue){
      let queueKey = driverQueue.store(payload.store, new Queue());
      currentQueue = driverQueue.read(queueKey);
    }
    currentQueue.store(payload.store, payload);

    caps.emit('PICKUP', payload);
  });


  // RECEIVED_______________________________________________
  socket.on('RECEIVED', (payload) => {
    let currentQueue = driverQueue.read(payload.store);
    if (!currentQueue){
      throw new Error('no queue created');
    }
    let message = currentQueue.remove(payload.store);
    socket.to(payload.store).emit('RECEIVED', payload);
  });

  // GETALL
  socket.on('GETALL', (payload) => {
    console.log('Retrieving jobs');
    let currentQueue = driverQueue.read(payload.store);
    if (currentQueue && currentQueue.data){
      Object.keys(currentQueue.data).forEach(store => {
        // socket.emit might need to be caps.emit
        socket.emit('PICKUP', currentQueue.read(store));
      });
    }
  });


  // IN-TRANSIT________________________________
  socket.on('TRANSIT', (payload) => {
    logEvent('TRANSIT', payload);
    caps.emit('TRANSIT', payload);
  });

  // DELIVERED_________________________________
  socket.on('DELIVERY', (payload) => {
    logEvent('DELIVERY', payload);
    caps.emit('DELIVERY', payload);
  });

});

function logEvent(event, payload) {
  const date = new Date();
  const time = date.toTimeString();
  console.log('EVENT', { event, time, payload });
}


