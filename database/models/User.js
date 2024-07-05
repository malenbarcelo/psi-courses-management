module.exports = (sequelize, DataTypes) => {

    const alias = "Users"
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
       password:{
          type: DataTypes.STRING,
          allowNull: false,
       },
       id_users_categories:{
       type: DataTypes.INTEGER,
       allowNull: false,
       },
       id_companies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
    }
    const config = {
    tableName : 'users',
    timestamps : false
    }
    const User = sequelize.define(alias, cols, config)
 
    User.associate = (models) => {
       User.belongsTo(models.Users_categories,{
          as:'users_categories',
          foreignKey: 'id_users_categories'
       }),
       User.belongsTo(models.Users_companies,{
         as:'users_companies',
         foreignKey: 'id_companies'
      })
    }
    return User
 }