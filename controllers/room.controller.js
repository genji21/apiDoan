const { roomService } = require("../services")
const PatternController = require("./pattern.controller")

const roomController = new PatternController(roomService)

module.exports = roomController
