class PatternController {

    constructor(service) {
        this.service = service
    }

    index = async (req, res) => {
        try {
            const query = req.query
            const data = await this.service.getAll(query)
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

    show = async (req, res) => {
        try {
            const id = req.params.id
            const data = await this.service.getDetail(id)
            if (!data) {
                return res.status(404).json({
                    mes: 'data not found'
                })
            }
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
};

module.exports = PatternController