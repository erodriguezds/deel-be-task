const { getProfile } = require('./../middleware/getProfile');
const { Op } = require("sequelize");

module.exports = function(app){

    app.get('/contracts/:id',getProfile ,async (req, res) =>{
        const {Contract} = req.app.get('models');
        const {id} = req.params;
        const contract = await Contract.findOne({where: {id}})
        if(!contract) return res.status(404).json({error: `Contract #${id} does not exists`});
        if(![contract.ClientId, contract.ContractorId].includes(req.profile.id)){
            return res.status(403).json({error: `Forbidden (you don't have access to this contract)`});
        }
        res.json(contract)
    })

    app.get('/contracts',getProfile ,async (req, res) =>{
        const { Contract } = req.app.get('models');

        // available relations to eager-load
        const relations = Object.keys(Contract.associations);

        // allow clients to specify, via query param, the relations to eager-load
        // (required by the front-end ;-)
        const include = (req.query.include || "")
            .split(',')
            .filter(model => relations.includes(model));

        const contracts = await Contract.findAll({
            where: {
                status: {
                    [Op.ne]: "terminated"
                },
                [Op.or]: [
                    {ContractorId: req.profile.id},
                    {ClientId: req.profile.id}
                ]
            },
            include
        });
        if(!contracts) return res.status(404).end()
        res.json(contracts)
    });
}
