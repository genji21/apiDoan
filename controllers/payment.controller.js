const { paymentService } = require("../services")
const PatternController = require("./pattern.controller")

const paymentController = new PatternController(paymentService)

module.exports = paymentController
