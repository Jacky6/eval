// 测评数据
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class data extends Model {
    }
    data.init({
        dataname: { type: DataTypes.STRING(140), allowNull: false, primaryKey: true, comment: '文件名'},
        dbname: { type: DataTypes.STRING(140), allowNull: false, comment: '来源数据库'},
        datapath: { type: DataTypes.STRING(140), allowNull: false, comment: '路径'},
        evalnum: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: true, comment: '被测评数'},
    }, {
        sequelize: sequelize,
        tableName: 'data',
        underscored: true,
        paranoid: false,    // 取消软删除，数据删除后相应的测评数据也会删除
        timestamps: false,
    });
    return data;
}

