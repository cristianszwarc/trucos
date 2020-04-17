import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './components/Layout.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const Root = (
  <Layout />
);

ReactDOM.render(
  Root,
  document.getElementById('app'),
);
