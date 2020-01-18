import React from 'react';

import { connect } from 'react-redux';

import { Navbar, Header, Services, Sorteos, Footer, Subastas } from './MyComponents';


const PageHome = ({ hasLoadedUserData }) => (
    hasLoadedUserData ?
      <>
        <Navbar />
        <Header />
        <Subastas />
        <Sorteos />
        <Services />
        <Footer />
      </>
    :
    <>
      <Navbar />
      <h1>Loading!</h1>
      <Footer />
    </>
);

const mapDispatchToProps = (state) => ({
  hasLoadedUserData: state.hasLoadedUserData
});

export default connect(mapDispatchToProps)(PageHome)