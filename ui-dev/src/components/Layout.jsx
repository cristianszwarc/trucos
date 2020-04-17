import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

import Tools from './Tools.jsx';
import config from '../config';

const Layout = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [tools, setTools] = useState();
  const [loadingMsg, setLoadingMsg] = useState('Loading tools...');

  useEffect(() => {
    if (!initialized) {

      const baseUrl = config.getBaseUrl();

      axios
        .get(
          `${baseUrl}/tools`
        )
        .then(({ data }) => {
          setTools(data);
        }).catch((error) => {
          console.error(error);
          setLoadingMsg('Failed');
      });
      setInitialized(true);
    }
  });

  const containerStyle = {
    padding: '5px',
    margin: '5px',
    border: '0px',
  };

  return tools ? (
    <Router>
      <div style={containerStyle}>
        <Tools tools={tools} />
      </div>
    </Router>
  ) : (
    <div>{loadingMsg}</div>
  );

};

export default hot(Layout);
