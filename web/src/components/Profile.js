import React from 'react';

import ProfileForm from './ProfileForm';

export default () => (
  <section className="bg-gradient page-section profile-section" id="portfolio">
    <div className="container">
      <div className="row">
        <div className="col-lg-12 text-center">
          <h2 className="section-heading text-uppercase">Perfil</h2>
          <h3 className="section-subheading text-muted">Lorem ipsum dolor sit amet consectetur.</h3>
        </div>
      </div>
      <div className="row">
        <ProfileForm />
      </div>
    </div>
  </section>
);