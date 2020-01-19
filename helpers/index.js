const jwt = require('jsonwebtoken');
const { getModelFromString, getModel, createModel, updateModel } = require('./dbmodels');

const { __JWTKEY } = require('../config.js');


const getJwtToken = async (email) => {
  return await new Promise((resolve, reject) => {
    jwt.sign({ email }, __JWTKEY, {}, async (err, jwtToken) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(jwtToken);
      }
    });
  });
}

module.exports = {
  dbModels: {
    getModelFromString,
    getModel,
    updateModel,
    createModel,
  },
  getJwtToken
}