let __MONGO_CONNECTION = `mongodb://localhost:27017/premiate`;
const mongoUser = 'premiateUser'
const mongoPass = 'premiate';
__MONGO_CONNECTION = `mongodb+srv://${mongoUser}:${mongoPass}@premiate-cyijj.mongodb.net/premiate?retryWrites=true&w=majority`;
module.exports = {
    __PORT: process.env.PORT | 8080,
    __JWTKEY: 'PRIVATESECRETKEY',
    __STARTINGCREDITS: 500,
    __SALTROUNDS: 10,
    __MONGO_CONNECTION, 
}