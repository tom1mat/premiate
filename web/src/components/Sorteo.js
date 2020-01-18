import React from 'react';
import { connect } from 'react-redux';
import { __API_URL } from '../config';
import { notification, Modal } from 'antd';

class Sorteo extends React.PureComponent {
  state = {
    isSuscribed: this.props.isSuscribed,
    isModalVisible: false,
  }
  onSuscribe = async () => {
    const body = JSON.stringify({
      jwtToken: this.props.jwtToken,
      sorteoId: this.props.id,
      email: this.props.userData.email
    });
    const res = await fetch(`${__API_URL}suscribeToSorteo`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const status = await res.status;

    if (status === 200) {
      this.setState({ isSuscribed: true });
      notification.success({
        placement: 'bottomRight',
        message: 'Te has suscripto exitosamente!',
      });
    } else {
      notification.success({
        placement: 'bottomRight',
        message: 'No te has podido subscribir en este momento, inténtalo de nuevo más tarde',
      });
    }
  }

  onUnSuscribe = async () => {
    const body = JSON.stringify({
      jwtToken: this.props.jwtToken,
      sorteoId: this.props.id,
      email: this.props.userData.email,
    });
    const res = await fetch(`${__API_URL}unSuscribeToSorteo`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const status = await res.status;

    if (status === 200) {
      this.setState({ isSuscribed: false })
      notification.success({
        placement: 'bottomRight',
        message: 'Te has desubscripto exitosamente!',
      });
    } else {
      notification.success({
        placement: 'bottomRight',
        message: 'No te has podido desubscribir en este momento, inténtalo de nuevo más tarde',
      });
    }
  }

  handleClick = (ev) => {
    ev.preventDefault();
    this.setState({ isModalVisible: true });
  }

  handleCancel = (ev) => {
    ev.preventDefault();
    this.setState({ isModalVisible: false });
  }

  render() {
    return (
      <>
        <Modal
          title={this.props.titulo}
          visible={this.state.isModalVisible}
          centered
          onCancel={this.handleCancel}
          footer={null}
        >
          <img className="img-fluid d-block mx-auto img-sorteo" src="img/portfolio/01-full.jpg" alt="" />
          {this.props.isSignedIn ?
            this.state.isSuscribed ?
              <button className="btn btn-primary" type="button" onClick={this.onUnSuscribe}>
                <i className="fas fa-times"></i>
                Desinscribirse
                    </button>
              :
              <button className="btn btn-primary" type="button" onClick={this.onSuscribe}>
                <i className="fas fa-times"></i>
                Inscribirse
                    </button>
            : <p className="text-center">Debes ingresar para participar!</p>
          }
        </Modal>
        <div className="col-md-4 col-sm-6 portfolio-item">
          <div className="portfolio-link" onClick={this.handleClick}>
            <div className="portfolio-hover">
              <div className="portfolio-hover-content">
                <i className="fas fa-plus fa-3x"></i>
              </div>
            </div>
            <img className="img-fluid" src="img/portfolio/01-thumbnail.jpg" alt="" />
          </div>
          <div className="portfolio-caption">
            <h4>{this.props.titulo}</h4>
            {
              this.state.isSuscribed ?
              <p>INSCRIPTO!</p>
              :
              <p className="text-muted">Participa</p>
            }
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    jwtToken: state.jwtToken,
    isSignedIn: state.isSignedIn,
    userData: state.userData,
  }
}

export default connect(mapStateToProps)(Sorteo);