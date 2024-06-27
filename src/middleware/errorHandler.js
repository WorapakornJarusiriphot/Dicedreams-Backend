// ไฟล์ errorHandler.js เป็นมิดเดิลแวร์สำหรับการจัดการข้อผิดพลาด (error handling middleware) ในแอปพลิเคชัน Express.js 
// ซึ่งจะใช้สำหรับการจัดการข้อผิดพลาดที่เกิดขึ้นในระหว่างการทำงานของเซิร์ฟเวอร์ และส่งข้อความข้อผิดพลาดกลับไปยังไคลเอนต์ในรูปแบบ JSON
module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; //โค้ดนี้ตรวจสอบว่ามีการกำหนดสถานะของข้อผิดพลาด (statusCode) หรือไม่ ถ้าไม่มี จะใช้ค่าเริ่มต้นเป็น 500 (Internal Server Error)

    return res.status(statusCode).json({ // โค้ดนี้ส่งการตอบกลับกลับไปยังไคลเอนต์ในรูปแบบ JSON โดยมีโครงสร้างดังนี้
        error: {
            status_code: statusCode, //status_code: สถานะของข้อผิดพลาด
            message: err.message, //message: ข้อความข้อผิดพลาดที่อธิบายว่าเกิดอะไรขึ้น
            validation: err.validation //validation: ข้อมูลการตรวจสอบข้อผิดพลาด (ถ้ามี)
        }
    });
}