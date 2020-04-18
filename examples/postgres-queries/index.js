const trucos = require('trucos');
const tools = require('./tools');

const pgConnection = require('./pgConnection');
pgConnection.connect();

const resolvers = {
  dbQuery: async (params, sortedParams, toolQuery) => {
    return pgConnection.query(toolQuery.id, toolQuery.SQL, sortedParams);
  },
};

trucos.run({
  port: 6006,
  tools: tools,
  resolvers: resolvers,
});
