const { hotelService } = require("../services")
const PatternController = require("./pattern.controller")
const hotelModel = require('../models/hotel.model')
const userModel = require("../models/userModel");
const { ObjectId } = require("mongodb");
class HotelComtroller extends PatternController {
    index = async (req, res) => {
        try {
            const query = req.query
            const config = {
                limit: query.limit || 10,
                page: query.page || 1
            }
            const filter = {
                location: req.query.location || null,
                rating: req.query.rating || null,
                type: req.query.type || null,
            }
            const data = await hotelService.getAll(config, filter)
            return res.status(200).json({
                mes: 'success',
                data
            })
        } catch (error) {
            return res.status(409).json({
                mes: error.message
            })
        }

    };

    search = async (req, res) => {
        try {
            const { search } = req.body
            const filter = {
                search
            }
            const data = await hotelService.search(filter)
            return res.status(200).json({
                mes: 'success',
                data
            })
        } catch (error) {
            return res.status(409).json({
                mes: error.message
            })
        }

    };
    create = async ( req,res) =>{
        try {
        
            const newHotel = new hotelModel({
                name:req.body.infor.name,
                userId:req.body.auth.id,
                image:req.body.infor.image,
                rating:10,
                numReview:0,
                rank:5,
                location:"Hồ Chí Minh",
                service:req.body.infor.service,
                type:"hotel",
                rooms:req.body.infor.rooms,
                thunhap:0
            })
            newHotel.save()
            res.json({msg:"SuccessFully"})
        } catch (error) {
            
        }
    }

}

const hotelController = new HotelComtroller(hotelService)

module.exports = hotelController
