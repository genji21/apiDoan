class PatternService {

    constructor(model) {
        this.model = model
    }

    getAll = (query) => {
        try {
            return this.model.find({}).sort(query)
        } catch (error) {
            throw new Error(error);
        }
        
    };

    getDetail = async (id) => {
        try {
            return this.model.findById(id)
        } catch (error) {
            throw new Error(error);
        }
        
    }

};

module.exports = PatternService;
