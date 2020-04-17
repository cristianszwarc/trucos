import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Tools from './Tools.jsx';
import Result from './Result.jsx';
import config from '../config';
import toolStates from "../toolStates";

const Tool = (props) => {
  const { tool, parentForm, queryParams } = props;

  const baseUrl = config.getBaseUrl();
  const endpoint = `${baseUrl}${tool.path}`;

  const previousState = toolStates.get(tool.id);
  const previousFormState = previousState.form || {};
  const previousResult = previousState.results;

  let formFieldsNames = tool.fields.reduce((obj, cur) => { return { ...obj, [cur.name]: queryParams[cur.name] || previousFormState[cur.name] || '' }; }, {});
  const [form, setValues] = useState(formFieldsNames);

  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState(previousResult);

  const [openLink, setOpenLink] = useState(previousResult);

  const executeTool = e => {
    e.preventDefault();
    setExecuting(true);
    setResults(null);
    axios
    .post(
      endpoint,
      form
    )
    .then(({ data }) => {
      setResults(data);
      setExecuting(false);
    })
    .catch((error) => {
      console.log(error);
      setExecuting(false);
    });

  };

  const updateField = e => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // copy values from parent
  useEffect(() => {
    tool.fields.forEach(f => {
      if (parentForm && parentForm[f.fromParent]) {
        setValues({
          ...form,
          [f.name]: parentForm[f.fromParent]
        });
      }
    });
  }, [props.parentForm]); // Only re-run the effect if props.parentForm changes

  // save current form or result state and update open link
  useEffect(() => {
    toolStates.set(tool.id, {
      form: form,
      results: results,
    });
    const generatedLink = Object.entries(form).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
    setOpenLink(`?${generatedLink}`);
  }, [form, results]);

  return (
    <div>

      <form onSubmit={executeTool}>
        <fieldset disabled={executing}>
          {tool.fields.map(field => (
            <div key={field.name}>
              <label>
                {field.label}
                <input
                  value={form[field.name]}
                  name={field.name}
                  onChange={updateField}
                />
              </label>
            </div>
          ))}
          { tool.queries && tool.queries.length ? <div><button>Run</button> <a href={openLink} target="_blank">new</a></div> : null}

          <Result results={results} tool={tool} />
        </fieldset>
      </form>

      <Tools tools={tool.tools} parentTool={tool} parentForm={form} />
    </div>
  );
};

export default Tool;
