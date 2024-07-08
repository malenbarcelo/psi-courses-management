module.exports = (sequelize, DataTypes) => {

    const alias = "Courses"
    const cols = {
       id:{
          type : DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement : true,
          allowNull: false
       },
       course_name:{
          type: DataTypes.STRING,
          allowNull: false,
       },
       course_description:{
          type: DataTypes.STRING,
          allowNull: true,
       },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
    }
    const config = {
    tableName : 'courses',
    timestamps : false
    }

    const Course = sequelize.define(alias, cols, config)
 
   return Course
 }