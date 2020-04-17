import React from 'react';
import ReactJson from 'react-json-view'

const Single = (props) => {
  const { data } = props;

  return data ? (
    <ReactJson src={data} />
  ) : (<div />);
};

export default Single;
