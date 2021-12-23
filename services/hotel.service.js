const PatternService = require("./pattern.service");
const { hotelModel } = require('../models');
const replaceTones = require('../ultis/funcSuport') 
class HotelService extends PatternService {

    constructor(model) {
        super(model)
    };

    getAll = async (config, { location, rating, type }) => {
        try {
            
            let query = {}

            if (location) {
                query = {
                    ...query,
                    location
                }
            }
            if (rating) {
                query = {
                    ...query,
                    rating: {
                        $gte: Number(rating)
                    }
                }
            }
            if (type) {
                query = {
                    ...query,
                    type
                }
            }

            const count = await this.model.find(query).count({})
            let payload = await this.model.find(query).limit(config.limit).skip(config.limit * (config.page - 1))

            return await {
                data: payload,
                meta: {
                    perPage: Number(config.limit),
                    total: count,
                    currentPage: Number(config.page),
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    // function-- search
    search = async ({ search }) => {
        try {

            let hotels = await this.model.find({})
            return hotels = await hotels.filter(hotel => 
                replaceTones(
                    hotel.name.trim()
                )
                .toLowerCase()
                .includes(
                    replaceTones(search.trim())
                    .toLowerCase()
                )
            )

        } catch (error) {
            throw new Error(error);
        }
    };
}

const hotelservice = new HotelService(hotelModel);

module.exports = hotelservice;
