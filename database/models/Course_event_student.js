module.exports = (sequelize, DataTypes) => {

    const alias = "Courses_events_students"
    const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      first_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      last_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      email:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      dni:{
         type: DataTypes.STRING,
         allowNull: false,
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
      tableName : 'courses_events_students',
      timestamps : false
   }

   const Course_event_student = sequelize.define(alias, cols, config)

   Course_event_student.associate = (models) => {
      Course_event_student.belongsTo(models.Courses_events,{
         as:'events_companies_events',
         foreignKey: 'id_events'
      }),
      Course_event_student.belongsTo(models.Users_companies,{
         as:'events_companies_companies',
         foreignKey: 'id_companies'
      })
      Course_event_student.belongsTo(models.Courses,{
         as:'events_companies_courses',
         foreignKey: 'id_courses'
      })
   }

   return Course_event_student

}