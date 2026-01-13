// api/index.js
// Vercel Serverless Entry Point
// DO NOT wrap Express again

const serverApp = require('../BackEnd/server');

module.exports = (req, res) => {
  return serverApp(req, res);
};
