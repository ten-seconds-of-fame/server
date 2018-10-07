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
var safetyNet = 0;
var isSafetyOn = true;


var interval = setInterval(function(){

  if(safetyNet <= 0){
    isSafetyOn = false;
    if(countdown < 0){
      // end stream, start up next stream
      countdown = 10;
      safetyNet = 10;
      isSafetyOn = true;
    }
  }else{
    safetyNet--;
  }

   console.log("countdown: " + countdown);
   console.log("safetyNet: " + safetyNet);
   console.log("isSafetyOn: " + isSafetyOn);
   io.emit('time',{countdown,safetyNet,isSafetyOn});
   countdown--;
}, 1000);

io.on('connection', socket => {
  console.log("on connection");
  socket.on('time', (req) => {
    console.log(req);
  })
  socket.on('add-time', req => {
    console.log("add-time");
    if(countdown >= 0){
      countdown+=1;
    }
  })
  socket.on('subtract-time', req=> {
    if(countdown > 0 && !isSafetyOn){
      countdown--;
    }
  })
  socket.on('disconnect', () => {
    console.log("user disconnected");
  })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} at ${NODE_ENV}`);
})