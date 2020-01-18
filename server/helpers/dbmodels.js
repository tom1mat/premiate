/* eslint-disable array-callback-return */
const sorteoModel = require('../models/sorteo');
const subastaModel = require('../models/subasta');
const userModel = require('../models/users');

const getModelFromString = (model) => {
  switch (model) {
    case 'sorteos':
      return sorteoModel;
    case 'subastas':
      return subastaModel;
    case 'users':
      return userModel;
    default:
      return null;
  }
}

const getModel = (modelString, data) => {
  return new Promise(async (resolve, reject) => {
    const model = getModelFromString(modelString);
    try {
      if (data) {
        await model.findOne(data, (error, retObject) => {
          if (error) {
            return reject(error);
          }
          return resolve(retObject);
        }).lean();
      } else {
        await model.find((error, retObjects) => {
          if (error) {
            return reject(error);
          }
          return resolve(retObjects);
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}

const createModel = async (modelString, data) => {
  return new Promise(async (resolve, reject)=>{
    const model = getModelFromString(modelString);
    const object = new model(data);

    try {
      await object.save();
      return resolve(model);
    } catch (error) {
      console.error(error);
      return reject();
    }
  });
}

const updateModel = async (modelString, query, data) => {
  try {
    const model = getModelFromString(modelString);
    const updated = await model.update(query, data);

    if (updated.ok === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  getModelFromString,
  getModel,
  createModel,
  updateModel,
}