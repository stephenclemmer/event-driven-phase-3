# event-driven-phase-3

Author: Stephen Clemmer

### Links and Resources

![Lab 13 UML](./assets/Lab%2013%20UML.png)

**Problem Domain**
Implement a system to guarantee that notification payloads are read by their intended subscriber by implementing a “Queue” system so that nothing gets lost. Every event sent will be logged and held onto by the server until the intended recipient acknowledges that they received the message. At any time, a subscriber can get all of the messages they might have missed.

Implement a “Queue” feature on the Server, allowing Driver and Vendor clients to subscribe to messages added to pickup and delivered queues.

 Retailers will be able to see in their dashboard or log, a list of all packages delivered in real time. Should a delivery driver deliver many packages while the retailer is not connected to the dashboard, the vendor client should be guaranteed to receive “delivery” notifications from the Queue system.

#### Global Event Pool (HUB)

**Use the socket.io npm package to configure an event Server that can be started at a designated port using node.**

- We still need the Server to configure socket connections to the caps namespace on a specified PORT.
- Create a Message Queue that can store payloads for specific Clients.
- Each payload that is read by the pickup event should be added to a Queue for Driver clients.
- Each payload that is read by the delivered event should be added to a Queue for Vendor clients.
- This could be as simple as an Object or Array, or as complex as a Module that connects to and performs operations against a database.

**Add a received event to the Global Event Pool.**

- When this event is heard on the server, assume it’s a Client Module telling you a payload was sucessfully read.
- The payload should include the client id, event name, and message id, so that you can delete it from the Queue.

**Add a getAll event to the Global Event Pool.
The payload should include the client id and event name.**

- When this event is heard on the server, find each of the messages in the queue for the client, for the event specified.
- Go through each of the entries for the client/event in the queue (if any) and broadcast them to the client.

**Refactor the delivered, pickup, and in-transit events in the Global Event Pool.**

- We need to be able to add payloads to the appropriate Queue for specific Clients.
- When these events are triggered, add the payload immediately to the appropriate Queue.
- Broadcast the same event, with the following payload to all subscribers:

 {
   "messageID": "Unique-Message-ID",
   "payload": "<ORIGINAL_PAYLOAD>"
 }


#### Vendor Client Application

**Create 2 separate “stores” that use the Vendor Client module.**

- Create one store called acme-widgets and 1-800-flowers.
- Connect to the CAPS Application Server using the caps namespace.
- Both stores should “subscribe” to different Queues, since they are separate stores.

**On startup, your client applications should trigger a getAll event that fetches all messages from the server that are in that Vendor’s Queue (events/messages they’ve not yet received).**

- Trigger the received event with the correct payload to the server.

**Subscribe to the delivered Queue.**

- Each client should be able to receive payloads “published” to the delivered Queue.
- We still want to log a confirmation with the “order-id” and payload.


#### Driver Client Application

**Refactor event logic to use Queues.**

- Make sure your Driver Client is subscribing to the appropriate Vendor Queues.
- Upon connection, Driver Client can fetch any messages added to their subscribed Queues.


**Tests**
NA

**File Structure**

├── config
│   ├── config.json
├── nodemodules
├── server
│   ├── lib
│   │   ├── queue.js
│   ├── server.index
├── src
│   ├── driver
│   │   ├── driver.indexjs
│   ├── lib
│   │   ├── messageClient.js
│   ├── vendor
│   │   ├── flowers.indexjs
│   │   ├── widgets.indexjs
├── editorconfig
├── .eslintignore
├── .eslintrc.json
├── .gitattributes
├── .gitignore
├── config.json
├── javascript-tests.yml
├── LICENSE
├── package-lock.json
├── package.json
└── README.md

### Features

### User Stories

The following user/developer stories detail the major functionality for this phase of the project.

- As a vendor, I want to “subscribe” to “delivered” notifications so that I know when my packages are delivered.
- As a vendor, I want to “catch up” on any “delivered” notifications that I might have missed so that I can see a complete log.
- As a driver, I want to “subscribe” to “pickup” notifications so that I know what packages to deliver.
- As a driver, I want to “catch up” on any “pickup” notifications I may have missed so that I can deliver everything.
- As a driver, I want a way to “scan” a delivery so that the vendors know when a package has been delivered.

- As a developer, I want to create a system of tracking who is subscribing to each event.
- As a developer, I want to place all inbound messages into a “queue” so that my application knows what events are to be delivered.
- As a developer, I want to create a system for communicating when events have been delivered and received by subscribers.
- As a developer, I want to delete messages from the queue after they’ve been received by a subscriber, so that I don’t re-send them.
- As a developer, I want to create a system for allowing subscribers to retrieve all undelivered messages in their queue.
