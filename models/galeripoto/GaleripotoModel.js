import { Sequelize } from "sequelize";
import db from "../../config/Database.js";
import Users from "../UserModel.js";

const {DataTypes} = Sequelize;

const Galeripoto = db.define('galeripoto', {
    uuid:{
        type: DataTypes.STRING, 
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    titleimage:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    image:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    kategori:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
},{
    freezeTableName: true
});

Users.hasMany(Galeripoto);
Galeripoto.belongsTo(Users, {foreignKey: 'userId'});

export default Galeripoto;