import React from 'react';
import { Link } from 'react-router-dom';

import LoginBox from './LoginBox';

export default () => (
  <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
    <div className="container">
      <Link to="/" className="navbar-brand js-scroll-trigger">
      <img src="img/logo-premiate.png" alt="" />
      </Link>
      <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        Menu
    <i className="fas fa-bars"></i>
      </button>
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav text-uppercase ml-auto">
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="#services">Services</a>
          </li>
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="#portfolio">Portfolio</a>
          </li>
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="#about">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="#team">Team</a>
          </li>
          <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href="#contact">Contact</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="pull-right">
      <LoginBox />
    </div>
  </nav>
);