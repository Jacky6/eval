// 测评表
const {Model} = require('sequelize');
const allocation = require('../alloction');

module.exports = (sequelize, DataTypes) => {
    
    const data = sequelize.import('./data');
    const User = sequelize.import('./user');
    const evalOpt = allocation.evalOpt;
    const obj = {};
    for(key in evalOpt){
        obj[evalOpt[key]] = {type: DataTypes.INTEGER, defaultValue:0, allowNull:true, comment: '指标'};
    }

    obj['comment'] = {type: DataTypes.STRING(140), allowNull: true, comment: '评论内容'}

    class ceping extends Model {
    }

    //  模型定义
    ceping.init(obj, {
        sequelize: sequelize,
        tableName: 'ceping',
        //timestamps: false,
        underscored: true,
        paranoid: true,
    });

    //关联定义
    ceping.belongsTo(data, {  // 测评属于数据
        constraints: false,
        foreignKey: 'dataname'
    })
    ceping.belongsTo(User, {   // 测评属于
        constraints: false,
        foreignKey: 'useraccount',
    })

    return ceping;
};