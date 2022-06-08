const { getProfile } = require('./../middleware/getProfile');
const { Op } = require("sequelize");

module.exports = function(app){
    app.get('/jobs/unpaid',getProfile ,async (req, res) =>{
        try {
            const { Job } = req.app.get('models');
            const sequelize = req.app.get('sequelize');

            // we trust there can't be SQL injection below because we're using data from the profile object
            const subquery = `SELECT id FROM Contracts WHERE (ContractorId = ${req.profile.id} OR ClientId = ${req.profile.id}) AND status <> 'terminated'`;
            const jobs = await Job.findAll({
                where: {
                    paid: null,
                    ContractId: {
                        [Op.in]: sequelize.literal(`(${subquery})`)
                    },
                }
            })
            res.json(jobs)
    
        } catch(error) {
            return res.status(500).json({error : error.message});
        }
    });
    
}
