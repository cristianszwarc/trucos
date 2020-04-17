import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import queryString from 'query-string';
import { Route } from 'react-router-dom';

import Tool from './Tool.jsx';

const Tools = (props) => {
  const { tools, parentTool, parentForm } = props;

  const tabPaneStyle = {
    'borderLeft': '0px solid #ddd',
    'borderRight': '0px solid #ddd',
    'borderBottom': '1px solid #ddd',
    'borderRadius': '0px 0px 5px 5px',
    padding: '10px',
    paddingRight: '0px',
    paddingLeft: '0px',
    backgroundColor: '#eeeeee',
  };

  const activeTabStyle = {
    backgroundColor: '#efefef',
    borderBottomColor: '#efefef',
  };

  const containerStyle = {
    backgroundColor: '#ffffff',
    padding: '0px',
    paddingTop: '10px',
    marginTop: '5px',
    border: '1px solid rgb(221, 221, 221)',
    // borderRadius: '5px',
  };

  return tools ? (
    <div style={containerStyle}>

      <Nav tabs>
        {tools.map(tool => (
          <NavItem key={tool.id}>
            <NavLink tag={RRNavLink} to={tool.path} activeClassName="active" activeStyle={activeTabStyle}>{tool.label}</NavLink>
          </NavItem>
        ))}
      </Nav>

        {tools.map(tool => {

          const thisTool = (props) => {
            const queryParams = queryString.parse(props.location.search);
            return (
              <TabContent activeTab="tool">
                <TabPane style={tabPaneStyle} tabId="tool">
                  <div className="execute-tool">
                    <Tool tool={tool} parentForm={parentForm} queryParams={queryParams}/>
                  </div>
                </TabPane>
              </TabContent>
            )
          };
          return <Route path={tool.path} component={thisTool} key={tool.id} />;
        })}

    </div>
  ) : (<div />);
};

export default Tools;
