module.exports = (sequelize, DataTypes) => {

    const alias = "Quotations_details"
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
      id_events:{
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      unit_price:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      quantity:{
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      subtotal:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      discount:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      total:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
    }

    const config = {
      tableName : 'quotations_details',
      timestamps : false,
   }

    const Quotation_detail = sequelize.define(alias, cols, config)

   //  Quotation_detail.associate = (models) => {
   //    Quotation_detail.belongsTo(models.Quotations,{
   //       as:'quotations',
   //       foreignKey: 'id_quotations'
   //    }),
   //    Quotation_detail.belongsTo(models.Courses_events,{
   //       as:'events',
   //       foreignKey: 'id_events'
   //    })
      
   //}
 
   return Quotation_detail
 }