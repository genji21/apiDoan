var express = require('express');
const { hotelController } = require('../controllers');
const authAdmin = require('../middleware/authAdmin');
var router = express.Router();

router.get('/', hotelController.index);

router.get('/:id', hotelController.show);

router.post('/search', hotelController.search);

router.post('/createHotel',authAdmin,hotelController.create)

module.exports = router;
