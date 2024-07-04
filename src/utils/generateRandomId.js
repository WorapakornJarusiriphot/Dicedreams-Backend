// ไฟล์นี้เป็นโมดูลสำหรับการสร้าง ID สุ่ม โดยใช้ไลบรารี uuid เพื่อสร้าง UUID (Universally Unique Identifier) และมีการปรับแต่ง UUID ให้เป็นรูปแบบที่ต้องการก่อนส่งออก
const { v4: uuidv4 } = require('uuid'); // เรียกใช้งาน uuid เพื่อสร้าง UUID ที่ไม่ซ้ำกัน และสุ่ม โดยใช้ uuidv4() ในการสร้าง UUID ใหม่ 
// ไลบรารี uuid ใช้ในการสร้าง UUID (Universally Unique Identifier) ซึ่งเป็นไอดีที่ไม่ซ้ำกันทั่วโลก ทำให้มั่นใจได้ว่าไอดีที่สร้างขึ้นจะไม่ซ้ำกับไอดีอื่นๆ

const generateRandomId = () => { // สร้างฟังก์ชัน generateRandomId ที่ใช้สำหรับสร้าง ID สุ่ม 
  return uuidv4().split('-').join(''); // ส่งค่า UUID ที่สร้างขึ้น และทำการตัด '-' ออก และเชื่อมต่อเข้าด้วยกัน
};

module.exports = { generateRandomId }; // ส่งออกฟังก์ชัน generateRandomId ที่สร้างขึ้น เพื่อให้สามารถเรียกใช้งานจากไฟล์อื่นได้ 

