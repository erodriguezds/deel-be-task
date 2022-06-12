const { getProfile } = require('./../middleware/getProfile');
const { Op } = require("sequelize");

const MAX_DEPOSIT_PERCENT = 25;

module.exports = function(app){
    app.post('/balances/deposit/:userId([0-9]+)', getProfile, async (req, res) => {

        // TODO: discuss who can invoke this action. Can any user "deposit" into any other user?
        // including the same user???

        try {
            const user = req.profile;
            const { userId } = req.params;
            const { Job, Contract, Profile } = req.app.get('models');
            const sequelize = req.app.get('sequelize');
            const ammount = req.body.ammount;

            if(!ammount || isNaN(ammount)){
                return res.status(400).json({error: `You must post a numeric 'ammount' to deposit`});
            }

            const recipient = await Profile.findOne({
                where: {
                    id: userId
                }
            });

            if(!recipient){
                return res.status(404).json({error: `Client #${userId} not found`});
            }

            if(recipient.type !== "client"){
                return res.status(403).json({
                    error: "Deposits can only be done to client accounts"
                });
            }

            // do the fun stuff
            const tResult = await sequelize.transaction(async t => {
                // we could do the following inside a transaction...
                const subquery = `SELECT id FROM Contracts WHERE ClientId = ${recipient.id}`;
                const totalToPay = await Job.sum('price', {
                    transaction: t,
                    where: {
                        paid: null,
                        ContractId: {
                            [Op.in]: sequelize.literal(`(${subquery})`)
                        }
                    }
                });
                
                const maxToDeposit = (
                    totalToPay === null ?
                    0 :
                    (totalToPay * ( MAX_DEPOSIT_PERCENT / 100.0 ))
                );

                if(ammount > maxToDeposit){
                    throw new Error(`Client's total debt is '${totalToPay || 0}'. You're allowed to deposit up to '${maxToDeposit}'`);
                }

                await Profile.update(
                    // changes
                    {
                        balance: sequelize.literal(`balance + ${ammount}`)
                    },
                    // options
                    {
                        transaction: t,
                        where: {
                            id: recipient.id
                        },
                    }
                );

                const recipientAfterUpdate = await Profile.findOne({
                    transaction: t,
                    where: {
                        id: recipient.id
                    },
                });

                return { newBalance: recipientAfterUpdate.balance };
            });

            return res.json({
                success: true,
                tResult
            });

        } catch(error){
            return res.status(500).json({error : error.message});
        }
    });

    app.get('/profiles', async (req, res) => {
        try {
            const { Profile } = req.app.get('models');
            const profiles = await Profile.findAll();

            return res.json(profiles);

        } catch(error){
            return res.status(500).json({error : error.message});
        }
    });

    app.get('/profiles/:id', async (req, res) => {
        try {
            const { Profile } = req.app.get('models');
            const id = parseInt(req.params.id);
            const profile = await Profile.findOne({
                where: { id }
            });

            return res.json(profile);

        } catch(error){
            return res.status(500).json({error : error.message});
        }
    });


}
