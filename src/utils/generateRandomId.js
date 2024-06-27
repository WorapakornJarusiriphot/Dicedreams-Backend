const { v4: uuidv4 } = require('uuid');

const generateRandomId = () => {
  return uuidv4().split('-').join('');
};

module.exports = { generateRandomId };

