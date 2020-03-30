import React from 'react';
import ReactDOM from 'react-dom';
import {Restaurant} from './restaurant';
import * as serviceWorker from './serviceWorker';
ReactDOM.render(
  <React.StrictMode>
      <Restaurant id="5e4fcf14af68ed25d5900f3e"/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
