const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const { Op } = require("sequelize");

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

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

app.get('/jobs/unpaid',getProfile ,async (req, res) =>{
    try {
        const {Contract, Job} = req.app.get('models');
        const {id} = req.params;
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

module.exports = app;
