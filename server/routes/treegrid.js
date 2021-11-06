const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const data = require('../data.json')

router.get('/', function(req, res, next) {
  res.status(200).json(data)
});

router.post('/', function(req, res, next) {
  const json = JSON.stringify(req.body)
  const jsonPath = path.join(__dirname, '../data.json')

  fs.promises.writeFile(jsonPath, json, 'utf8')
    .then(() => {
      res.status(200).json(JSON.parse(json))
    })
});

module.exports = router;
