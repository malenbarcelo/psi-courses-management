module.exports = (sequelize, DataTypes) => {

    const alias = "Users_companies"
    const cols = {
       id:{
          type : DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement : true,
          allowNull: false
       },
       company_name:{
          type: DataTypes.STRING,
          allowNull: false,
       },
       enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
    }
    const config = {
    tableName : 'users_companies',
    timestamps : false
    }

    const User_company = sequelize.define(alias, cols, config)

    User_company.associate = (models) => {
      User_company.hasMany(models.Users,{
         as:'companies_users',
         foreignKey: 'id_companies'
      })
   }

    return User_company
 }