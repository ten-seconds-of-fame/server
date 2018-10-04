'use strict'
import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 4229;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('*', (req,res)=>{
  res.send("Ten Seconds of Fame Server");
})

// Timer
var countdown = 0;
var interval = setInterval(function(){
   if(countdown < 0){
    countdown = 10;
   }
   console.log(countdown);
   io.emit('time',countdown);
   countdown--;
}, 1000);

io.on('connection', socket => {
  console.log("on connection");
  socket.on('time', (req) => {
    console.log(req);
  })
  socket.on('disconnect', () => {
    console.log("user disconnected");
  })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} at ${NODE_ENV}`);
})