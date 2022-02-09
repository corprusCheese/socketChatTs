import { Request, Response } from 'express';

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = 3000

app.get('/', (_req: Request, res: Response) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(port, () => {
  console.log('listening on *:' + port);
});
