import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define ('users', {
    uuid:{
        type: DataTypes.STRING, 
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len:[3, 100]
        }
    },
    namalengkap:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len:[3, 100]
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    jwt_token:{
        type: DataTypes.TEXT
    },
},{
    freezeTableName: true
});

export default Users;