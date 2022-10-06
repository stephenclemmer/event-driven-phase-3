'use strict';

module.exports = (socket) => (payload) => {

  setTimeout(() => {
    console.log(`in transit ${payload.order.orderId}`);
    socket.emit('TRANSIT', payload);
  }, 3000);
};
