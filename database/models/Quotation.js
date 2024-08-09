module.exports = (sequelize, DataTypes) => {

    const alias = "Quotations"
    const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      quotation_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      subtotal:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      discount:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      total:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      id_status:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      created_at:{
         type: DataTypes.DATE,
         allowNull: true,
      },
      updated_at:{
         type: DataTypes.DATE,
         allowNull: true,
      },
      id_users_quotation:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_users_aproval:{
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
    }

    const config = {
      tableName : 'quotations',
      timestamps : true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
   }

    const Quotation = sequelize.define(alias, cols, config)

    Quotation.associate = (models) => {
      Quotation.belongsTo(models.Users,{
         as:'quotations_users_quotation',
         foreignKey: 'id_users_quotation'
      }),
      Quotation.belongsTo(models.Users,{
         as:'quotations_users_aproval',
         foreignKey: 'id_users_aproval'
      }),
      Quotation.belongsTo(models.Quotations_status,{
         as:'quotations_status',
         foreignKey: 'id_status'
      })
   }
 
   return Quotation
 }