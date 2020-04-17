'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const md5 = require('md5');
const _ = require('lodash');
const open = require('open');

module.exports = {
  run: (params) => {
    if (!_.isPlainObject(params)) {
      console.log('missing parameters object');
      return process.exit(1)
    }

    if (!_.isArray(params.tools)) {
      console.log('tools must be an array');
      return process.exit(1)
    }

    if (!_.isPlainObject(params.resolvers)) {
      console.log('resolvers must be a plain object');
      return process.exit(1)
    }

    if (!params.port) {
      console.log('missing port');
      return process.exit(1)
    }

    const host = params.host ? params.host : 'localhost';
    const port = params.port;
    const https = !!params.https;
    const baseUrlPath = params.baseUrlPath ? params.baseUrlPath : '';
    const baseUrl = `http${https ? 's':''}://${host}:${port}`;

    const tools = params.tools;
    const resolvers = params.resolvers;

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    app.get(`${baseUrlPath}/`, (req, res) => {
      res.status(200).send(`Trucos is running: ${baseUrl}`);
    });

    app.listen(port);
    console.log(`Trucos is running: ${baseUrl}`);

    (async () => {
      await open(`${baseUrl}${baseUrlPath}/`);
    })();

  },
};
