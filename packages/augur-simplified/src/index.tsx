import React from 'react';
import ReactDOM from 'react-dom';
import App from 'modules/App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import { windowRef } from 'utils/window-ref';
import { AppStatusProvider } from 'modules/stores/app-status';

windowRef.appStatus = {};

ReactDOM.render(
  <AppStatusProvider>
    <HashRouter hashType="hashbang">
      <App />
    </HashRouter>
  </AppStatusProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
