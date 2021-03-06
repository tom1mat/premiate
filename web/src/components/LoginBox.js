import React from 'react';
import { connect } from 'react-redux';
import { Checkbox, notification } from 'antd';
import { Link } from 'react-router-dom';

import { __API_URL } from '../config';
import { setLocalItem, removeLocalItem } from '../utils';

class LoginButton extends React.PureComponent {
  state = {
    isSignedIn: false,
    hasAcceptedTerms: false,
  }

  fetchLogIn = async (email, password) => {
    let url = `${__API_URL}getUserData?email=${email}`;
    if (password) url += `&password=${password}`;
    const res = await fetch(url);
    if (res.status === 200) {
      const userData = await res.json();
      this.props.setJwtToken(userData.jwtToken);
      this.props.setUserData(userData);
      this.props.setLogIn();
      setLocalItem('email', email);
    } else {//if (res.status === 204) {
      //El usuario no existe
      notification.warning({
        placement: 'bottomRight',
        message: 'Usuario y/o contraseña inválidos',
      });
    }
  }

  onHandleGoogleLogIn = () => {
    this.props.auth2.signIn().then(async () => {
      const email = this.props.auth2.currentUser.get().getBasicProfile().getEmail();
      this.fetchLogIn(email);
    });
  }

  onHandleLogOut = () => {
    this.props.auth2.signOut().then(() => {
      this.props.setLogOut();
      removeLocalItem('email');
    });
  }

  onHandleCreateUserFromGoogle = (ev) => {
    ev.preventDefault();
    if (this.state.hasAcceptedTerms) {
      this.props.auth2.signIn().then(async () => {
        const profile = this.props.auth2.currentUser.get().getBasicProfile();
        const body = JSON.stringify({
          googleData: {
            avatar: profile.getImageUrl(),
            googleId: profile.getId(),
            userName: profile.getName(),
          },
          surname: profile.getFamilyName(),
          name: profile.getGivenName(),
          email: profile.getEmail(),
        });
        const res = await fetch(`${__API_URL}createAccountFromGoogle`, {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 200) {
          const userData = await res.json();
          this.props.setJwtToken(userData.jwtToken);
          this.props.setUserData(userData);
          this.props.setLogIn();
        } else if (res.status === 204) {
          notification.warning({
            placement: 'bottomRight',
            message: 'Ya hay un usuario registrado con esta cuenta',
          });
          //El usuario ya existe
        }
      });
    } else {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debe aceptar los términos',
      });
    }
  }

  onHandleCreateUser = async (ev) => {
    ev.preventDefault();
    if (this.state.hasAcceptedTerms) {
      ev.preventDefault();
      const { createEmail, createPassword } = this.state;
      if (createEmail && createPassword) {
        const body = JSON.stringify({
          email: this.state.createEmail,
          password: this.state.createPassword,
        });
        const res = await fetch(`${__API_URL}createAccount`, {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 200) {
          const userData = await res.json();
          this.props.setJwtToken(userData.jwtToken);
          this.props.setUserData(userData);
          this.props.setLogIn();
        } else if (res.status === 204) {
          notification.warning({
            placement: 'bottomRight',
            message: 'Ya hay un usuario registrado con ese email',
          });
          //El usuario ya existe
        }
      } else {
        notification.warning({
          placement: 'bottomRight',
          message: 'Debe ingresar un usuario y contraseña',
        });
      }
    } else {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debe aceptar los términos',
      });
    }
  }

  onHandleLogin = (ev) => {
    ev.preventDefault();
    const { loginEmail, loginPassword } = this.state;
    if (loginEmail && loginPassword) {
      this.fetchLogIn(loginEmail, loginPassword);
    } else {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debe ingresar un usuario y contraseña',
      });
    }
  }

  onHandleChangeLoginEmail = (ev) => {
    this.setState({
      loginEmail: ev.target.value,
    });
  }

  onHandleChangeLoginPassword = (ev) => {
    this.setState({
      loginPassword: ev.target.value,
    });
  }

  onHandleChangeCreateEmail = (ev) => {
    this.setState({
      createEmail: ev.target.value,
    });
  }

  onHandleChangeCreatePassword = (ev) => {
    this.setState({
      createPassword: ev.target.value,
    });
  }

  onHandleTermsChange = (ev) => {
    this.setState({ hasAcceptedTerms: ev.target.checked });
  }

  render() {
    return !this.props.hasLoadedUserData ?
      <i className="fas fa-circle-notch fa-spin"></i>
      :
      this.props.isSignedIn ?
        <>
          {this.props.userData.name && 
            <span className="nav-link">Hola {this.props.userData.name}!</span>
          }
          <div className="nav-link credits-container"><i className="fas fa-money-bill-wave"></i>{this.props.userData.credits}</div>
          <Link to="/cuenta" className="nav-link js-scroll-trigger">
            Mi perfil
          </Link>
          <a className="nav-link js-scroll-trigger" onClick={this.onHandleLogOut} href="#contact">LOG OUT</a>
        </>
        :
        <>
          <div className="nav-item dropdown">
            <button className="nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Crear cuenta
            </button>
            <div className="dropdown-menu login-box" aria-labelledby="navbarDropdown">
              <button className="nav-link js-scroll-trigger text-gray" onClick={this.onHandleCreateUserFromGoogle}>Crear desde <i className="fab fa-google"></i></button>
              <div className="dropdown-divider"></div>
              <form>
                <input className="login-input" type="text" placeholder="Email" onChange={this.onHandleChangeCreateEmail} />
                <input className="login-input" type="password" placeholder="Contraseña" onChange={this.onHandleChangeCreatePassword} />
                <Checkbox onChange={this.onHandleTermsChange}>
                  Acepto los <a href="politicas.html" target="_blank">términos</a>
                </Checkbox>
                <button className="btn btn-success login-button" onClick={this.onHandleCreateUser}>Crear</button>
              </form>
            </div>
          </div>
          <div className="nav-item dropdown">
            <button className="nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Ingresar
            </button>
            <div className="dropdown-menu login-box" aria-labelledby="navbarDropdown">
              <button className="nav-link js-scroll-trigger text-gray" onClick={this.onHandleGoogleLogIn}>Entrar desde <i className="fab fa-google"></i></button>
              <div className="dropdown-divider"></div>
              <form>
                <input className="login-input" type="text" placeholder="Email" onChange={this.onHandleChangeLoginEmail} />
                <input className="login-input" type="password" placeholder="Contraseña" onChange={this.onHandleChangeLoginPassword} />
                <button className="btn btn-success login-button" onClick={this.onHandleLogin}>Entrar</button>
              </form>
            </div>
          </div>
        </>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setJwtToken: (payload) => {
      dispatch({
        type: 'SET_JWT_TOKEN',
        payload,
      })
    },
    setUserData: (payload) => {
      dispatch({
        type: 'SET_USER_DATA',
        payload,
      })
    },
    setLogIn: () => {
      dispatch({
        type: 'LOG_IN'
      })
    },
    setLogOut: () => {
      dispatch({
        type: 'LOG_OUT'
      })
    },
    setHasLoadedUserData: () => {
      dispatch({
        type: 'SET_HAS_LOADED_USER_DATA'
      })
    },
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.isSignedIn,
    userData: state.userData,
    hasLoadedUserData: state.hasLoadedUserData,
    auth2: state.auth2,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginButton);