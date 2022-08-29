// 用户
const {Model} = require('sequelize');
const security = require('../shared/security');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        // 检测密码
        checkPassword(rawPassword) {
            return security.sha256(rawPassword) === this.password;
        }
    }

    User.init({
        useraccount: {
            type: DataTypes.STRING(20),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: '账号不能为空'
                },
                len: {
                    msg: '账号长度为6-20位',
                    args: [6, 20]
                },
                isAlphanumeric: {
                    msg: '账号只能包含字母和数字'
                }
            },
            comment: '账号'
        },
        password: {type: DataTypes.CHAR(64), allowNull: false, comment: '密码'},
        nickname: {type: DataTypes.STRING(20), allowNull: false, defaultValue: '', comment: '昵称'},
        evalnum: {type: DataTypes.INTEGER, allowNull: true, defaultValue: 0, comment: '已参与测评数量'}
    }, {
        sequelize: sequelize,
        tableName: 'user',
        underscored: true,
        paranoid: true, //软删除
        timestamps: false,
        indexes: [  //索引
            {
                unique: true,   // 唯一索引
                fields: ['useraccount'],    // 索引字段
            }
        ]
    });

    User.beforeSave((user) => {
        // 密码处理
        if (user.changed('password') && user.password.length > 0) {
            user.password = security.sha256(user.password);
        }
    });
    
    return User;
};
