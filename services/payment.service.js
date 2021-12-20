const PatternService = require("./pattern.service");
const { paymentModel } = require('../models')

const paymentservice = new PatternService(paymentModel);

module.exports = paymentservice;
