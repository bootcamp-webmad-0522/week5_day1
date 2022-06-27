const bcrypt = require('bcryptjs');
const saltRounds = 10;
const plainPassword1 = 'HelloWorld';

const salt = bcrypt.genSaltSync(saltRounds);
const hash1 = bcrypt.hashSync(plainPassword1, salt);

console.log('HASH --->', hash1)

const matched = bcrypt.compareSync('HelloWorld', hash1)

console.log('¿Coinciden?', matched)