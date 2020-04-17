import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view'

const Json = (props) => {
  const { data } = props;

  return data ? (
    <ReactJson src={data} />
  ) : (<div />);
};

export default Json;
