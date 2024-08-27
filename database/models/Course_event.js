module.exports = (sequelize, DataTypes) => {

    const alias = "Courses_events"
    const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_courses:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      start_date:{
         type:DataTypes.DATE,
         allowNull: false
      },
      end_date:{
         type:DataTypes.DATE,
         allowNull: false
      },
      start_time:{
         type:DataTypes.TIME,
         allowNull: false
      },
      end_time:{
         type:DataTypes.TIME,
         allowNull: false
      },
      event_quota:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
    }

   const config = {
      tableName : 'courses_events',
      timestamps : false
   }

   const Course_event = sequelize.define(alias, cols, config)

   Course_event.associate = (models) => {
      Course_event.belongsTo(models.Courses,{
         as:'events_courses',
         foreignKey: 'id_courses'
      }),
      Course_event.hasMany(models.Courses_quota_reservations,{
         as:'events_quota_reservations',
         foreignKey: 'id_events'
      }),
      Course_event.hasMany(models.Courses_events_invited_companies,{
         as:'events_invited_companies',
         foreignKey: 'id_events'
      }),
      Course_event.hasMany(models.Courses_events_students,{
         as:'events_students',
         foreignKey: 'id_events'
      }),
      Course_event.hasMany(models.Quotations_events_companies,{
         as:'quotations_events_companies',
         foreignKey: 'id_events'
      })
   }

   return Course_event

}