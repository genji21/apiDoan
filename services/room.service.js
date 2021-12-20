const PatternService = require("./pattern.service");
const { roomModel } = require('../models')

const roomservice = new PatternService(roomModel);

module.exports = roomservice;
