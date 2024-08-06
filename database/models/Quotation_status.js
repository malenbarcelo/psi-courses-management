module.exports = (sequelize, DataTypes) => {

    const alias = "Quotations_status"
    const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      quotation_status:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
    }

    const config = {
      tableName : 'quotations',
      timestamps : false
    }

    const Quotation_status = sequelize.define(alias, cols, config)
     
   return Quotation_status
 }