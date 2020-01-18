import React from 'react';
import { connect } from 'react-redux';

import Sorteo from './Sorteo';

import { __API_URL } from '../config';

class Sorteos extends React.PureComponent {
  state = {
    sorteos: []
  }
  async componentDidMount() {
    const res = await fetch(`${__API_URL}getSorteos`);
    const sorteos = await res.json();
    this.setState({ sorteos });
  }

  render() {
    const userSorteos = (this.props.userData && this.props.userData.sorteos) ? this.props.userData.sorteos : [];
    return (
      <section className="bg-light page-section" id="portfolio">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading text-uppercase">Sorteos</h2>
              <h3 className="section-subheading text-muted">Lorem ipsum dolor sit amet consectetur.</h3>
            </div>
          </div>
          <div className="row">
            {this.state.sorteos.map((sorteo, index) => <Sorteo key={sorteo._id} id={sorteo._id} titulo={sorteo.sorteo} isSuscribed={!!userSorteos[sorteo._id]} />)}
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
  }
}

export default connect(mapStateToProps)(Sorteos);