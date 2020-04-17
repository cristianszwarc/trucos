import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import Json from './Json.jsx';
import Table from './Table.jsx';
import Single from './Single.jsx';

const Result = (props) => {
  const { results, tool } = props;
  const { queries } = tool;

  const [activeTab, setActiveTab] = useState(queries && queries.length ? queries[0].id : '');

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  };

  const tabPaneStyle = {
    'borderLeft': '1px solid #ddd',
    'borderRight': '1px solid #ddd',
    'borderBottom': '1px solid #ddd',
    'borderRadius': '0px 0px 5px 5px',
    backgroundColor: '#ffffff',
    padding: '10px',
  };

  const containerStyle = {
    backgroundColor: '#f5faff',
    padding: '10px',
    marginTop: '5px',
    marginBottom: '5px',
    border: '1px solid rgb(221, 221, 221)',
    // borderRadius: '5px',
  };

  const queriesToBeRun = queries && queries.length ? <div><b>Queries:</b> {queries.map((query) => query.label).join(', ')}</div> : null;

  return results ? (
    <div style={containerStyle}>

      <Nav tabs>
        {results.map((result, idx) => (
          <NavItem key={queries[idx].id}>
            <NavLink
              className={classnames({ active: activeTab === queries[idx].id })}
              onClick={() => { toggle(queries[idx].id); }}
            >
              {queries[idx].label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {results.map((result, idx) => (
          <TabPane style={tabPaneStyle} key={queries[idx].id} tabId={queries[idx].id}>
            <Row>
              <Col sm="12">
                { queries[idx].display === 'table' ? <Table data={result} query={queries[idx]}/> : null}
                { queries[idx].display === 'single' ? <Single data={result[0]} query={queries[idx]}/> : null}
                { queries[idx].display === 'json' ? <Json data={result} query={queries[idx]}/> : null}
              </Col>
            </Row>
          </TabPane>
        ))}

      </TabContent>
    </div>
  ) : queriesToBeRun;
};

export default Result;
