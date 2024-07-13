module.exports = (sequelize, DataTypes) => {

    const alias = "Courses_events_invited_companies"
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
      id_courses:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
    }

   const config = {
      tableName : 'courses_events_invited_companies',
      timestamps : false
   }

   const Course_event_invited_company = sequelize.define(alias, cols, config)

   Course_event_invited_company.associate = (models) => {
      Course_event_invited_company.belongsTo(models.Courses_events,{
         as:'events_companies_events',
         foreignKey: 'id_events'
      }),
      Course_event_invited_company.belongsTo(models.Users_companies,{
         as:'events_companies_companies',
         foreignKey: 'id_companies'
      })
      Course_event_invited_company.belongsTo(models.Courses,{
         as:'events_companies_courses',
         foreignKey: 'id_courses'
      })
   }

   return Course_event_invited_company

}