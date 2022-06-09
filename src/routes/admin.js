const { QueryTypes } = require("sequelize");

module.exports = function(app){
    app.get('/admin/best-profession', async (req, res) => {
        try {
            const sequelize = req.app.get('sequelize');
            const { start, end } = req.query;

            const data = await sequelize.query(
                `SELECT p.profession, SUM(j.price) AS totalPaid
                FROM Jobs j
                JOIN Contracts c ON j.ContractId = c.id
                JOIN Profiles p ON c.ContractorId = p.id
                WHERE j.paid IS NOT NULL
                AND j.paymentDate BETWEEN :start AND :end
                GROUP BY profession
                ORDER BY totalPaid DESC
                LIMIT 1`,
                {
                  replacements: { start, end },
                  type: QueryTypes.SELECT
                }
              );

            return res.json(data);

        } catch(error){
            return res.status(500).json({error : error.message});
        }
    });

    app.get('/admin/best-clients', async (req, res) => {
        try {
            const sequelize = req.app.get('sequelize');
            const { start, end, limit = 2 } = req.query;

            const data = await sequelize.query(
                `SELECT
                    (p.firstName || ' ' || p.lastName) AS Client,
                    SUM(j.price) AS totalPaid
                FROM Jobs j
                JOIN Contracts c ON j.ContractId = c.id
                JOIN Profiles p ON c.ClientId = p.id
                WHERE j.paid IS NOT NULL
                AND j.paymentDate BETWEEN :start AND :end
                GROUP BY profession
                ORDER BY totalPaid DESC
                LIMIT :limit`,
                {
                  replacements: { start, end, limit },
                  type: QueryTypes.SELECT
                }
              );

            return res.json(data);

        } catch(error){
            return res.status(500).json({error : error.message});
        }
    });
}
