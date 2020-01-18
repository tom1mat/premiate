import React from 'react';
import { connect } from 'react-redux';

import {
  Form,
  Input,
  Button,
  Card,
  notification,
} from 'antd';

import ButtonMercadoPago from './ButtonMercadoPago';
import { __API_URL } from '../config';

class RegistrationForm extends React.Component {
  state = {
    ammount: 100,
  }
  componentWillMount() {
    const { name, surname, email, googleData } = this.props.userData;
    this.setState({ name, surname, email, googleData });
  }

  handleSubmit = async e => {
    e.preventDefault();
    const { name, surname, email } = this.state;
    const body = JSON.stringify({
      name,
      surname,
      email,
      queryEmail: this.props.userData.email,
      jwtToken: this.props.jwtToken,
    });

    const res = await fetch(`${__API_URL}updateUser`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 200) {
      this.props.dispatch({
        type: 'SET_USER_DATA',
        payload: {
          ...this.props.userData,
          name,
          surname,
          email,
        }
      });
      notification.success({
        placement: 'bottomRight',
        message: 'Los datos se han editado exitosamente!',
      });
    } else {
      notification.error({
        placement: 'bottomRight',
        message: 'Error, no se han podido editar los datos',
      });
    }
  };

  handleNameChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  handleSurnameChange = e => {
    this.setState({
      surname: e.target.value
    });
  };

  handleEmailChange = e => {
    this.setState({
      email: e.target.value
    });
  };

  handleAmmountChange = (ev) => {
    this.setState({ ammount: ev.target.value });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    if (this.props.isSignedIn) {
      const { name, surname, email, googleData } = this.state;

      const avatar = (googleData && googleData.avatar ? googleData.avatar : null);

      return (
        <>
          <Card
            hoverable
            className="card-profile"
            cover={avatar ? <img alt="avatar" className="google-avatar" src={avatar} /> : null}
          >
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="profile-form" hideRequiredMark>
              <Form.Item label="Nombre">
                <Input value={name} onChange={this.handleNameChange} />
              </Form.Item>
              <Form.Item label="Apellido">
                <Input value={surname} onChange={this.handleSurnameChange} />
              </Form.Item>
              <Form.Item label="Email">
                <Input value={email} onChange={this.handleEmailChange} />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Guardar
                </Button>
              </Form.Item>
            </Form>
            <ButtonMercadoPago text="Cargar 100 credits" ammount={100} />
            <ButtonMercadoPago text="Cargar 500 credits" ammount={500} />
            <ButtonMercadoPago text="Cargar 1000 credits" ammount={1000} />
          </Card>
        </>
      );
    }

    return <h1>Cargando!</h1>;
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
  isSignedIn: state.isSignedIn,
  jwtToken: state.jwtToken,
})

export default connect(mapStateToProps)(Form.create({ name: 'register' })(RegistrationForm));