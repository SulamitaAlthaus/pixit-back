const Sequelize = require('sequelize')
require('dotenv').config()

const database = new Sequelize(
    process.env.NODE_BD_NAME,
    process.env.NODE_BD_USER,
    process.env.NODE_BD_PASSWORD, {
    dialect: 'mysql',
    host: process.env.NODE_BD_HOST,
    port: process.env.NODE_BD_PORT
})

database.authenticate().then(() => {
    console.log('Conectado ao banco de dados')
}).catch(err => {
    console.error('Houve um erro ao tentar conectar no banco de dados: ', err);
});
module.exports = database