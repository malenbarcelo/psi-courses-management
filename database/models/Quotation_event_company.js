module.exports = (sequelize, DataTypes) => {

    const alias = "Quotations_events_companies"
    const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_events:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_companies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_quotations:{
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      id_quotations_status:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      requires_quotation:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
    }

    const config = {
      tableName : 'quotations_events_companies',
      timestamps : false
   }

    const Quotation_event_company = sequelize.define(alias, cols, config)

    Quotation_event_company.associate = (models) => {
      Quotation_event_company.belongsTo(models.Courses_events,{
         as:'event',
         foreignKey: 'id_events'
      }),
      Quotation_event_company.belongsTo(models.Users_companies,{
         as:'company',
         foreignKey: 'id_companies'
      }),
      Quotation_event_company.belongsTo(models.Quotations,{
         as:'quotation',
         foreignKey: 'id_quotations'
      }),
      Quotation_event_company.belongsTo(models.Quotations_status,{
         as:'quotation_status',
         foreignKey: 'id_quotations_status'
      })
   }
 
   return Quotation_event_company
 }