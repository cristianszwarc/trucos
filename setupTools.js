const _ = require('lodash');
const md5 = require('md5');

// prepare tools
const setupTools = (expressApp, toolBasePath, toolsToSetup, resolvers) => {
  toolsToSetup.forEach((tool) => {
    const currentPath = `${toolBasePath}${tool.endpoint}/`;

    // assign ids to all queries
    tool.queries.forEach((query) => {
      query.id = md5(query.query || query.resolver);
    });

    // expose an endpoint to allow the execution of this tool
    setupEndpoint(expressApp, currentPath, tool, resolvers);

    // continue setup of any sub tool
    if (tool.tools) {
      setupTools(expressApp, currentPath, tool.tools, resolvers);
    }

    // assign the current path and id to the tool
    tool.path = currentPath;
    tool.id = md5(currentPath);
  });
};

const setupEndpoint = (expressApp, path, tool, resolvers) => {
  expressApp.post(path, async (req, res) => {
    // the result is given by the execution of all queries inside the tool
    const results = await Promise.all(tool.queries.map(async (query) => {

      // fail if there is no resolver defined for this query
      if (!_.has(resolvers, query.resolver)) {
        throw new Error(`no resolver for tool ${tool.label} (path ${path})`);
      }

      // get values from the POST body and create an object according to the expectations of the current query
      // also generate an array with the values in the same order specified in the current query
      const paramsAndValues = {};
      const sortedParams = [];
      query.params.forEach(expectedParameter => {
        // mind that the field can have a name of "search" but the parameter accepted by the query can wrap it in wildcards
        const formFieldName = expectedParameter.replace(new RegExp('%', 'g'), '');
        const valueFromBody = req.body[formFieldName];

        // if the query parameter is expecting wildcards, add them wrapping the value
        const startWildcard = expectedParameter.startsWith('%') ? '%' : '';
        const endWildcard = expectedParameter.endsWith('%') ? '%' : '';
        const wrappedValue = `${startWildcard}${valueFromBody}${endWildcard}`;

        paramsAndValues[formFieldName] = wrappedValue;
        sortedParams.push(wrappedValue);
      });

      console.log(`executing resolver ${query.resolver} with:`, paramsAndValues, sortedParams);
      let rows = await resolvers[query.resolver](paramsAndValues, sortedParams, query);
      // console.log(`result:`, JSON.stringify(rows));

      return rows;

    }));

    res.status(200).json(results);
  });

};

module.exports = setupTools;
