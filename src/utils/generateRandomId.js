// generateRandomId.js
const { v4: uuidv4 } = require('uuid');

// สร้าง function สำหรับสร้างค่าเริ่มต้นของ comment_id
const generateRandomId = () => {
  return uuidv4().split('-').join('');
};

module.exports = { generateRandomId };

