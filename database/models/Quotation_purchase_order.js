module.exports = (sequelize, DataTypes) => {

    const alias = "Quotations_purchase_orders"
    const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_quotations:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_companies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      file_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
    }

    const config = {
      tableName : 'quotations_purchase_orders',
      timestamps : false
   }

    const Quotation_purchase_order = sequelize.define(alias, cols, config)

    Quotation_purchase_order.associate = (models) => {
      Quotation_purchase_order.belongsTo(models.Quotations,{
         as:'quotation',
         foreignKey: 'id_quotations'
      }),
      Quotation_purchase_order.belongsTo(models.Users_companies,{
         as:'company',
         foreignKey: 'id_companies'
      })
   }
 
   return Quotation_purchase_order
 }