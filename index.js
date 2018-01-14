import http from 'http';
import SocketIO from 'socket.io';
import express from 'express';
import keypress from 'keypress';
import moment from 'moment';
import WebSocket from 'ws';
const port = 8080;
const wss = new WebSocket.Server({ port });
let registeredDevices = {};

keypress(process.stdin);

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    let cmds = message.split(':');
    let cmd = cmds[0];
    if (cmd === 'register') {
      console.log('register device');
      registeredDevices[cmds[1]] = ws;
    } else if (cmd === 'up') {
      registeredDevices[cmds[1]].send('up');
    } else if (cmd === 'down') {
      registeredDevices[cmds[1]].send('down');
    } else if (cmd === 'stop') {
      registeredDevices[cmds[1]].send('stop');
    }
  });

  process.stdin.on('keypress', (ch, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else if (key && key.name == 'up') {
      console.log('emit full mast');
      ws.send('up');
    } else if (key && key.name == 'down') {
      console.log('emit half mast');
      ws.send('down');
    } else if (key && key.name == 'space') {
      console.log('stop');
      ws.send('stop');
    }
  });

});

process.stdin.setRawMode(true);
process.stdin.resume();
