'use strict';

module.exports = (socket) => (payload) => {

  setTimeout(() => {
    console.log(`delivered ${payload.order.orderId}`);
    socket.emit('DELIVERY', payload);
  }, 2000);
};
