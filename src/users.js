// pages/api/users.js
const express = require('express');
const router = require('../../../src/app/api/users'); // ปรับ path ตามที่คุณกำหนดจริง
const app = express();

app.use(express.json());
app.use('/api/users', router);

export default (req, res) => app(req, res);
