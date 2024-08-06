module.exports = (sequelize, DataTypes) => {

    const alias = "Courses_quota_reservations"
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
      },
      reserved_quota:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_users:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
    }

   const config = {
      tableName : 'courses_quota_reservations',
      timestamps : true,
      createdAt: 'created_at',
      updatedAt: 'update_at'
   }

   const Course_quota_reservations = sequelize.define(alias, cols, config)

   Course_quota_reservations.associate = (models) => {
      Course_quota_reservations.belongsTo(models.Courses_events,{
         as:'events_companies_events',
         foreignKey: 'id_events'
      }),
      Course_quota_reservations.belongsTo(models.Users_companies,{
         as:'events_companies_companies',
         foreignKey: 'id_companies'
      }),
      Course_quota_reservations.belongsTo(models.Courses,{
         as:'events_companies_courses',
         foreignKey: 'id_courses'
      }),
      Course_quota_reservations.belongsTo(models.Users,{
         as:'reservations_users',
         foreignKey: 'id_users'
      })
   }

   return Course_quota_reservations

}