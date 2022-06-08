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

    app.post('/jobs/:id/pay', getProfile, async (req, res) => {
        try {
            const user = req.profile;
            const {id} = req.params;
            const { Job, Contract, Profile } = req.app.get('models');
            const sequelize = req.app.get('sequelize');

            // not required, but...
            if(user.type !== 'client'){
                return res.status(400).json({message: `Only client's can pay a job. Your user's current type is '${user.type}'`});
            }

            const job = await Job.findOne({
                where: {
                    id
                },
                include: Contract
            });

            if(job.Contract.ClientId !== user.id){
                return res.status(403).end();
            }

            if(job.paid){
                return res.status(400).json({message: `Job is already paid`});
            }

            // do the fun stuff
            const tResult = await sequelize.transaction(async t => {
                
                // deduct  balance from client
                await Profile.update(
                    // changes
                    {
                        balance: sequelize.literal(`balance - ${job.price}`)
                    },
                    // options
                    {
                        where: {
                            id: job.Contract.ClientId
                        },
                        transaction: t
                    }
                );

                // add balance to congtractor
                await Profile.update(
                    // changes
                    {
                        balance: sequelize.literal(`balance + ${job.price}`)
                    },
                    // options
                    {
                        where: {
                            id: job.Contract.ContractorId
                        },
                        transaction: t
                    }
                );

                // check client's balance
                const client = await Profile.findOne({
                    transaction: t,
                    where: {
                        id: job.Contract.ClientId
                    }
                });

                if(client.balance < 0){
                    throw new Error("Insufficient balance");
                }

                // finally, update job as paid
                await Job.update(
                    // changes
                    {
                        paid: 1,
                        paymentDate: new Date(), //now
                    },
                    // options
                    {
                        where: {
                            id: job.id
                        },
                        transaction: t
                    }
                );
              });

            res.json({
                success: true,
                tResult
            })
        } catch(error){
            return res.status(500).json({error : error.message});
        }

    });
}
