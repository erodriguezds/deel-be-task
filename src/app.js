const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const { Op } = require("sequelize");

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

require("./routes/jobs")(app);
require("./routes/profiles")(app);

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const contract = await Contract.findOne({where: {id}})
    if(!contract) return res.status(404).end();
    if(![contract.ClientId, contract.ContractorId].includes(req.profile.id)){
        return res.status(403).end();
    }
    res.json(contract)
})

app.get('/contracts',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const contracts = await Contract.findAll({
        where: {
            status: 'in_progress',
            [Op.or]: [
                {ContractorId: req.profile.id},
                {ClientId: req.profile.id}
            ]
        }
    })
    if(!contracts) return res.status(404).end()
    res.json(contracts)
});

module.exports = app;
