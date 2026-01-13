// api/index.js
const express = require('express');
const serverApp = require('../BackEnd/server');

const app = express();

console.log('🚀 Vercel API handler initialized');

app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  return serverApp(req, res, next);
});

module.exports = app;
