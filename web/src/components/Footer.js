import React from 'react';

export default () => <footer className="footer">
  <div className="container">
    <div className="row align-items-center">
      <div className="col-md-4">
        <span className="copyright">Copyright &copy; Your Website 2019</span>
      </div>
      <div className="col-md-4">
        <ul className="list-inline social-buttons">
          <li className="list-inline-item">
            <a target="_blank" rel="noopener noreferrer" href="https://instagram.com/premiateok">
              <i className="fab fa-instagram"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="col-md-4">
        <ul className="list-inline quicklinks">
          <li className="list-inline-item">
            <a target="_blank" href="politicas.html">Políticas de privacidad</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>;