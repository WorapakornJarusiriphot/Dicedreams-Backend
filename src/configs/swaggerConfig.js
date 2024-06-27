// ไฟล์นี้เป็นการกำหนดค่าและการตั้งค่าสำหรับ Swagger ซึ่งเป็นเครื่องมือที่ใช้ในการสร้างเอกสาร API อัตโนมัติสำหรับ Dicedreams Application
const swaggerJsdoc = require('swagger-jsdoc'); //นำเข้าโมดูล swagger-jsdoc ซึ่งใช้ในการสร้างและแสดงเอกสาร API
const swaggerUi = require('swagger-ui-express'); //นำเข้าโมดูล swagger-ui-express ซึ่งใช้ในการสร้างและแสดงเอกสาร API

const options = { //กำหนดค่าสำหรับการสร้างเอกสาร API โดยใช้ swagger-jsdoc
  definition: { //กำหนดค่าสำหรับเอกสาร API 
    openapi: '3.0.0', //กำหนดเวอร์ชันของ OpenAPI
    info: { //กำหนดข้อมูลของ API
      title: 'Dicedreams API', //กำหนดชื่อของ API
      version: '1.0.0', //กำหนดเวอร์ชันของ API
      description: 'API Documentation for Dicedreams Application', //กำหนดคำอธิบายของ API
      contact: { //กำหนดข้อมูลของผู้พัฒนา API
        name: "Worapakorn Jarusiriphot", //ชื่อของผู้พัฒนา API
        url: "https://www.youtube.com/channel/UChBSP5RDoVu7jcA1lBK6aww", //ลิงก์ของผู้พัฒนา API
        email: "644259018@webmail.npru.ac.th", //อีเมลของผู้พัฒนา API
      },
    },
    externalDocs: { //กำหนดลิงก์ของเอกสาร API
      description: "Download Swagger.json", //คำอธิบายลิงก์ของเอกสาร API
      url: "/swagger.json", //ลิงก์ของเอกสาร API
    },
    servers: [ //กำหนดเซิร์ฟเวอร์ของ API
      { //กำหนดเซิร์ฟเวอร์ของ API
        url: 'http://localhost:8080/api', //ลิงก์ของเซิร์ฟเวอร์
        description: "Development server", //คำอธิบายเซิร์ฟเวอร์
      },
    ],
    components: { //กำหนดค่าสำหรับส่วนของคอมโพเนนท์
      securitySchemes: { //กำหนดค่าสำหรับการรักษาความปลอดภัย
        bearerAuth: { //กำหนดค่าสำหรับการรักษาความปลอดภัย
          type: 'http', //กำหนดประเภทของระบบการรักษาความปลอดภัย
          scheme: 'bearer', //กำหนดระบบการรักษาความปลอดภัย
          bearerFormat: 'JWT', //กำหนดรูปแบบของ JWT
        },
      },
    },
    security: [ //กำหนดค่าสำหรับการรักษาความปลอดภัย
      {
        bearerAuth: [], //กำหนดค่าสำหรับการรักษาความปลอดภัย
      },
    ],
  },
  apis: ['./src/routers/*.js'], //กำหนดที่อยู่ของไฟล์ที่ใช้สำหรับสร้างเอกสาร API
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };


// Bearer Token คือรูปแบบของโทเค็นที่ใช้ในการยืนยันตัวตนและการให้สิทธิ์ (authentication and authorization) 
// ในระบบการยืนยันตัวตนแบบโทเค็น (token-based authentication) โดยโทเค็นนี้จะถูกส่งผ่านในหัวข้อของคำขอ HTTP (HTTP header) 
// เพื่อให้เซิร์ฟเวอร์ทราบว่าผู้ใช้มีสิทธิ์ในการเข้าถึงทรัพยากรหรือบริการที่ร้องขอ