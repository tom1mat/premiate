import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { Card, InputNumber, notification, Button } from 'antd';

import { __API_URL } from '../config';

import ButtonMercadoPago from './ButtonMercadoPago';

class Subasta extends React.PureComponent {
  state = {
    ammount: this.props.ammount,
    localAmmount: 1,
    notification: '',
    creditsUsed: (this.props.userData && this.props.userData.creditsUsed) ? this.props.userData.creditsUsed : 0,
    isRaiseButtonDisabled: false,
  }

  async componentDidMount() {
    const subastaDate = new Date(this.props.dateString)
    const secondsDiff = subastaDate.getTime()/1000 - Date.now()/1000;

    if(secondsDiff > 0 ){

    const daysDecimal = secondsDiff / 60 / 60 / 24;
    const days = Math.trunc(daysDecimal);

    const hoursDecimal = (daysDecimal - days) * 24;
    const hours = Math.trunc(hoursDecimal);

    const minutesDecimal = (hoursDecimal - hours) * 60;
    const minutes = Math.trunc(minutesDecimal);

    const secondsDecimal = (minutesDecimal - minutes) * 60;
    const seconds = Math.trunc(secondsDecimal);
    
    this.setState({ seconds, minutes, hours, days })
      const interval = setInterval(() => {
        this.setState({ seconds: this.state.seconds - 1 })
        let { seconds, hours, minutes, days } = this.state;
  
        if(seconds === 0){
          if(minutes === 0){
            if(hours === 0){
              if(days === 0){
                this.setState({ seconds: 0, minutes: 0, hours: 0, days: 0 })
                clearInterval(interval);
              }else{
                this.setState({ days: days - 1 })
                this.setState({ hours: 23 })
                this.setState({ minutes: 59 });
                this.setState({ seconds: 59 });
              }
            }else{
              this.setState({ hours: hours - 1 });
              this.setState({ minutes: 59 });
              this.setState({ seconds: 59 });
            }
          }else{
            this.setState({ minutes: minutes - 1 });
            this.setState({ seconds: 59 });
          }
        }
      }, 1000);

      this.setState({ interval });
    } else {
      this.setState({ seconds: 0, minutes: 0, hours: 0, days: 0 })
    }

    const _this = this;
    const socket = io(`${__API_URL}`);
    socket.on('connect', function () {
      socket.on('updateSubastas', function (subastas) {
        _this.setState({ subastas });
      });
      socket.on(`raise-${_this.props.id}`, function (ammount, email, name) {
        if (email !== _this.props.userData.email) {
          notification.info({
            placement: 'bottomRight',
            message: `${name || 'Un usuario '} aumentó el importe a ${ammount}`,
          });
        }

        _this.setState({ ammount })
      });
    });
  }

  componentWillUnmount () {
    clearInterval(this.state.interval);
  }

  handleRaise = async (e) => {
    e.preventDefault();
    // creditsUsed: Los credits que el usuario aposto, pero que todavia no gano porque no termino la apuesta.
    // localAmmount: los credits que el usuario apuesta por cada apuesta.
    // ammount: los credits de la subasta.
    // userCredits: Los credits que tiene el usuario en su cuenta.
    const { creditsUsed, localAmmount, ammount } = this.state;
    if (!this.props.isSignedIn) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debes ingresar para poder subir una apuesta!',
      });
      window.scrollTo(0, 0);
      return;
    }

    if (localAmmount === 0) {
      notification.warning({
        placement: 'bottomRight',
        duration: 15,
        message: 'Debes ingresar un importe mayor!'
      });
      return;
    }

    const userCredits = this.props.userData.credits;
    const creditsSum = creditsUsed + localAmmount;
    
    if (creditsSum > userCredits) {
      this.setState({ isRaiseButtonDisabled: true });
      const diff = creditsSum - userCredits;
      notification.warning({
        placement: 'bottomRight',
        message: <>No tienes credits suficientes! Te faltan {diff} <ButtonMercadoPago text="Recargar" ammount={diff} /></>,
        onClose: () => this.setState({ isRaiseButtonDisabled: false }),
      });
      return;
    }

    const body = JSON.stringify({
      jwtToken: this.props.jwtToken,
      id: this.props.id,
      email: this.props.userData.email,
      name: this.props.userData.name,
      ammount: localAmmount + ammount,
      userAmmount: localAmmount,
    });
    const response = await fetch(`${__API_URL}raiseSubasta`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const status = await response.status;

    if (status === 200) {
      const data = await response.json();
      this.setState({ creditsUsed: data.creditsUsed });
      console.log(data);
      notification.success({
        placement: 'bottomRight',
        message: 'Has podido aumentar exitosamente!',
      });
    } else {
      notification.error({
        placement: 'bottomRight',
        message: 'Error, no has podido aumentar',
      });
    }
  }

  handleLocalAmmount = (value) => {
    this.setState({ localAmmount: value });
  }

  render() {
    const { seconds, minutes, hours, days } = this.state;
    return (
      <Card
        hoverable
        style={{ width: 240 }}
        className="card-subasta"
        cover={<img alt="parlante" width="240" src="https://d26lpennugtm8s.cloudfront.net/stores/105/049/products/parlante-portatil-panacom-2500w-sp30601-f7468dded3d4e9a75415126339587614-1024-1024.jpg" />}
      >
        <p>{seconds} Segundos</p>        
        <p>{minutes} Minutos</p>
        <p>{hours} Horas</p>
        <p>{days} Días</p>
        <div className="ammount">{this.state.ammount}</div>
        <form>
          <InputNumber
            defaultValue={1}
            onChange={this.handleLocalAmmount}
            min={1}
          />
          <label>{this.state.notification}</label>
          <Button disabled={this.state.isRaiseButtonDisabled} type="success" onClick={this.handleRaise}>Subir apuesta</Button>
        </form>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    jwtToken: state.jwtToken,
    isSignedIn: state.isSignedIn,
    userData: state.userData,
  }
}

export default connect(mapStateToProps)(Subasta);