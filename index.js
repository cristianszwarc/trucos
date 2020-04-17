'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const _ = require('lodash');
const open = require('open');
const setupTools = require('./setupTools');

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

    const html = `<!DOCTYPE html>
                    <html>
                        <head>
                            <title>Trucos</title>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width">
                            <link href="${baseUrlPath}/app.css" rel="stylesheet">
                        </head>
                        <body>
                            <div id="app"></div>
                            <script type="text/javascript" src="${baseUrlPath}/ui.bundle.js"></script>
                        </body>
                    </html>`;

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    // try static files first
    app.use(`${baseUrlPath}/`, express.static(path.join(__dirname, '/ui-dist')));

    // next allow commands from the UI
    setupTools(app, `${baseUrlPath}/`, tools, resolvers);

    // expose the tools definition
    app.get(`${baseUrlPath}/tools`, (req, res) => {
      res.status(200).json(tools);
    });

    // catch all for single page app
    app.get(`${baseUrlPath}/*`, (req, res) => {
      res.status(200).send(html);
    });

    app.listen(port);
    console.log(`Trucos is running: ${baseUrl}`);

    if (!params.noAutoBrowser) {
      (async () => {
        await open(`${baseUrl}${baseUrlPath}/`);
      })();
    }

  },
  md5: require('md5'),
  dotenv: require('dotenv'),
};
