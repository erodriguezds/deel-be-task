
class QueryBuilder {

    attributes = [];
    table = null;
    conditions = {};
    sequelize = null;

    constructor(sequelize){
        this.sequelize = sequelize;
    }

    select(attributes = '*'){
        if(Array.isArray(attributes)){
            this.attributes.push(...attributes);
        } else {
            this.attributes.push(attributes);
        }

        return this;
    }

    from(table){
        this.table = table;
        return this;
    }

    where(conditions){
        this.conditions = conditions;
        return this;
    }

    sql(){
        return this.sequelize.dialect.queryGenerator.selectQuery(this.table, {
            attributes: this.attributes,
            where: this.where
        }).slice(0,-1); // to remove the ';' from the end of the SQL
    }
}

module.exports = QueryBuilder;
