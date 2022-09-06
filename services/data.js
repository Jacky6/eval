const sequelize = require('../shared/sequelize');
const data = sequelize.import('../models/data');

// 批量添加数据（管理员功能）
// 参数 obj = [{数据1名字，dbname, datapath},{数据2,...},...]
exports.publish = async function (obj){
    try{
        const res = await data.bulkCreate(obj, {
            individualHooks: true,  // 对每个数据分别执行一遍生命周期函数
        });
        console.log('插入成功', res.map(res => { res.toJSON() }));
    }
    catch (e) {
        console.log('插入失败', e);
    } 
}

// 查询一条数据
exports.show = async function (dataname) {
    return data.findByPk(dataname);
};

// 所有数据列表
exports.list = async function (page = 1, size = 10) {
    return data.findAndCountAll({
        limit: size,
        offset: (page - 1) * size,
        order: [['evalnum', 'DESC']],
    });
};

// 首页随机一条数据
exports.randone = async function () {
    return await data.findOne({
        attributes: ['dataname','datapath'],
        order: [sequelize.literal('rand()')]
    });
};

//  数据被测评数目加一
exports.addevalnum = async function (dataname){
    const targetdata = await data.findOne({
        where:{
            dataname,
        }
    });
    targetdata.evalnum = targetdata.evalnum + 1;
    return await targetdata.save();
}

//  数据被测评数目减一
exports.delevalnum = async function (dataname){
    const targetdata = await data.findOne({
        where:{
            dataname,
        }
    });
    targetdata.evalnum = targetdata.evalnum - 1;
    return await targetdata.save();
}

