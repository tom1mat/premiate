import React from 'react';
import { connect } from 'react-redux';

import { Navbar, Footer, Profile } from './MyComponents';

const PageProfile = ({ hasLoadedUserData }) => (
  hasLoadedUserData ?
    <>
      <Navbar />
      <Profile />
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

export default connect(mapDispatchToProps)(PageProfile);