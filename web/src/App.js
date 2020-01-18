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

const store = createStore(reducers);

(() => {
  window.gapi.load('auth2', async () => {
    window.gapi.auth2.init({
      client_id: __CLIENT_ID_GOOGLE,
    }).then(async (auth2) => {
      let email;
      if (auth2.isSignedIn.get()) {
        email = auth2.currentUser.get().getBasicProfile().getEmail();
      } else {
        email = getLocalItem('email');
      }

      if (email) {
        const response = await fetch(`${__API_URL}getUserData?email=${email}`);

        if (response.status === 200) {
          const userData = await response.json();
          store.dispatch({
            type: 'SET_JWT_TOKEN',
            payload: userData.jwtToken,
          });
          store.dispatch({
            type: 'SET_USER_DATA',
            payload: userData,
          });
          store.dispatch({
            type: 'LOG_IN',
          });
        } else if (response.status === 204) {
          notification.warning({
            placement: 'bottomRight',
            message: 'El usuario no existe',
          });
        }
      }
      store.dispatch({
        type: 'SET_HAS_LOADED_USER_DATA',
      });
      store.dispatch({
        type: 'SET_AUTH2',
        payload: auth2,
      })
    });
  });
})();

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
