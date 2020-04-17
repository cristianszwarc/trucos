// {
//   "presets": ["@babel/preset-env", "@babel/preset-react"],
//   "plugins": [
//     "react-hot-loader/babel",
//     "@babel/plugin-syntax-dynamic-import"
//   ]
// }

module.exports = api => {
  const plugins = [
    "@babel/plugin-syntax-dynamic-import",
  ];

  // inject react-hot-loader babel plugin in development only
  if (api.env("development")) {
    plugins.unshift("react-hot-loader/babel");
  }

  return {
    presets: [
      ["@babel/preset-env", {
        "useBuiltIns": "entry",
        "modules": false,
        "debug":true
      }],
      "@babel/preset-react",
    ],
    plugins
  };
};
