const trucos = require('trucos');

const someClients = [
  { id: 1, name: 'Dominique Lukens', country: 'France', age: 45 },
  { id: 2, name: 'Candra Sabia', country: 'Spain', age: 27 },
  { id: 3, name: 'Felice Lukens', country: 'France', age: 36 },
];

const resolvers = {
  searchClientsByName: (params) => {
    return someClients.filter(client => client.name.toLowerCase().includes(params.search.toLowerCase()));
  },
  searchClientsByCountry: (params) => {
    return someClients.filter(client => client.country.toLowerCase().includes(params.search.toLowerCase()));
  },
  getFullClient: (params) => {
    return someClients.find(client => client.id === parseInt(params.id));
  },
};

const tools = [
  {
    "endpoint": "search",
    "label": "Search",
    "fields": [
      {
        "type": "string",
        "name": "search",
        "label": "Search"
      }
    ],
    "queries": [
      {
        "label": "by names",
        "resolver": "searchClientsByName",
        "params": ["search"],
        "display": "table",
        "links": [
          {
            "name": "Details",
            "link": "/details/?id={id}"
          }
        ]
      },
      {
        "label": "by country",
        "resolver": "searchClientsByCountry",
        "params": ["search"],
        "display": "table",
        "links": [
          {
            "name": "Details",
            "link": "/details/?id={id}"
          }
        ]
      },
    ]
  },
  {
    "endpoint": "details",
    "label": "Details",
    "fields": [
      {
        "type": "string",
        "name": "id",
        "label": "Id"
      }
    ],
    "queries": [
      {
        "label": "Full object",
        "resolver": "getFullClient",
        "params": ["id"],
        "display": "json",
      },
    ]
  },
];

trucos.run({
  port: 6006,
  tools: tools,
  resolvers: resolvers,
});
