const express = require('express');
const { roomStatus } = require('../controllers/statusController');

const router = express.Router();

router.route("/room-status").get(roomStatus);

module.exports = router;
