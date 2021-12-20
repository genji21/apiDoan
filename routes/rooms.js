var express = require('express');
const { roomController } = require('../controllers');
var router = express.Router();

router.get('/', roomController.index);

router.get('/:id', roomController.show);

module.exports = router;
