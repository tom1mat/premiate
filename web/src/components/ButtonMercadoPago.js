import React from 'react';

import { __API_URL } from '../config';

export default class MercadoPago extends React.PureComponent {
  componentDidMount() {
    const script = document.createElement("script");
    script.id = 'script-mp';
    script.src = 'https://www.mercadopago.com.ar/integrations/v1/web-tokenize-checkout.js';
    script.dataset.transactionAmount = this.props.amount;
    script.dataset.buttonLabel = this.props.text;
    script.dataset.publicKey = 'TEST-7af68b1a-40c3-443b-8f30-7aef37a45c65';
    script.async = true;
    document.getElementById('form-mercadopago').appendChild(script);
  }

  render() {
    return <form action={`${__API_URL}process-payment`} method="POST" id="form-mercadopago"></form>;
  }
}