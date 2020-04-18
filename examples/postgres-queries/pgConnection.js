'use strict';

const { Client } = require('pg');

module.exports = {
  connected: false,

  client: new Client({
    host: process.env.POSTGRES_DB_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_DB_PORT,
  }),

  query: async function (name, query, values) {
    try {
      const res = await this.client.query({
        name: name,
        text: query,
        values: values,
      });

      return res.rows;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },

  connect: async function () {
    if (this.connected) {
      return;
    }
    try {
      console.log('connecting');
      await this.client.connect();
      console.log('connected');
      this.connected = true;
    } catch (e) {
      console.error(e);
    }
  },

  end: async function () {
    if (!this.connected) {
      return;
    }
    try {
      console.log('disconnecting');
      await this.client.end();
      this.connected = false;
    } catch (e) {
      console.error(e);
    }
  },

};
