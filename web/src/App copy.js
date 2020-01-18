import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { notification } from 'antd';

import { getLocalItem } from './utils';
import { __API_URL, __CLIENT_ID_GOOGLE } from './config';

import reducers from './reducers';
import PageHome from './components/PageHome';
import PageProfile from './components/PageProfile';

function getData(){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve({sarasa: 'asd'})
    }, 10000);
  })
}

const data = getData().then(data =>{
  console.log(data);
})

const store = createStore(reducers, data);

export default () => (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <PageHome />
          </Route>
          <Route path="/cuenta">
            <PageProfile />
          </Route>
        </Switch>
      </Router>
    </Provider>
);
