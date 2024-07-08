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
         as:'course_course_event',
         foreignKey: 'id_courses'
      })
   }

   return Course_event

}