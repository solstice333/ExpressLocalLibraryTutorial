const localLibraryDb = 'mongodb://127.0.0.1:27017/localLibrary';
const mongoose = require('mongoose');
const app = require('../app');
const http = require('http');

function onListening() {
   mongoose.connect(localLibraryDb, { useNewUrlParser: true })
      .catch(err => {
         console.error(`MongoDB connection error: ${err}`);
         process.exit(1);
      });
}

function onClose() { mongoose.connection.close(); }

let server = http.createServer(app);

server.on('listening', onListening);
server.on('close', onClose);

module.exports = server;
