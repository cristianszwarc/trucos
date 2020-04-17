import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {
  withRouter,
  Link
} from 'react-router-dom'

const Table = (props) => {
  const { data, query } = props;
  const firstRow = data.length ? data[0] : {};
  const columns = Object.keys(firstRow).map(c => ({
    Header: c,
    accessor: c,
  }));

  if (query.links) {
    columns.push({
      header: '',
      id: 'links',
      Cell: row => {
        return (<div>
          {query.links.map((link, idx) => {
            let targetUrl = link.link;
            Object.keys(row.original).forEach((col) => {
              targetUrl = targetUrl.replace(`{${col}}`, row.original[col]);
            });
            return targetUrl.includes('http') ? (<a href={targetUrl} key={`open${idx}`} target="_blank">{link.name}</a>) : (<Link key={`open${idx}`} to={targetUrl}>{link.name}</Link>);
          })}
        </div>);
      }
    });
  }

  return <ReactTable
    data={data}
    columns={columns}
    defaultPageSize={10}
    getTdProps={(state, rowInfo, column, instance) => {
      return {
        onClick: (e, handleOriginal) => {
          console.log('A Td Element was clicked!');
          console.log('it produced this event:', e);
          console.log('It was in this column:', column);
          console.log('It was in this row:', rowInfo);
          console.log('It was in this table instance:', instance);

          // if (query.link) {
          //   let targetUrl = query.link;
          //   Object.keys(rowInfo.original).forEach((col) => {
          //     targetUrl = targetUrl.replace(`{${col}}`, rowInfo.original[col]);
          //     console.log(targetUrl);
          //     props.history.push(targetUrl)
          //   });
          // }

          // IMPORTANT! React-Table uses onClick internally to trigger
          // events like expanding SubComponents and pivots.
          // By default a custom 'onClick' handler will override this functionality.
          // If you want to fire the original onClick handler, call the
          // 'handleOriginal' function.
          if (handleOriginal) {
            handleOriginal()
          }
        }
      }
    }}
  />

};
export default withRouter(Table);

