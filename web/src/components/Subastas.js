import React from 'react';

import { Subasta } from './MyComponents';

import { __API_URL } from './config';

export default class Subastas extends React.Component {
  constructor() {
    super();
    this.state = {
      subastas: null
    }
  }

  async componentDidMount() {
    const response = await fetch(`${__API_URL}getSubastas`);
    if (response.status === 200) {
      const subastas = await response.json();
      this.setState({ subastas });
    }
  }

  render() {
    if (this.state.subastas) {
      return <section className="bg-light page-section container-subastas">
        <div className="container text-center">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2 className="section-heading text-uppercase">Subastas</h2>
              <h3 className="section-subheading text-muted">Lorem ipsum dolor sit amet consectetur.</h3>
            </div>
          </div>
          <div className="row">
          {this.state.subastas.map((subasta) => ( <Subasta key={subasta._id} id={subasta._id} ammount={subasta.ammount} title={subasta.title} dateString={subasta.dateString}/>))}
          </div>
        </div>
      </section>
    } else {
      return <div>No hay subastas</div>;
    }
  }
}