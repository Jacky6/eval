// index.js
const sequelize = require('./shared/sequelize');

sequelize.import('./models/data');
sequelize.import('./models/user');
sequelize.import('./models/ceping');


//sequelize.define('ceping', obj);

sequelize.sync({force: true}).catch((err) => console.error(err)).finally(() => sequelize.close());
