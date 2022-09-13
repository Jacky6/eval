const sequelize = require('../shared/sequelize');
const data = sequelize.import('../models/data');
const ceping = sequelize.import('../models/ceping');
const allocation = require('../alloction');

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

// 查询一条数据均值 
// 输入：dataname
// 输出：avg = {dataname,dbname,datapath,evalnum,avgindex1,avgindex2,..}
exports.show = async function (dataname) {
    const {dbname, datapath, evalnum} = await data.findByPk(dataname);
    const evalOpt = allocation.evalOpt;
    const avg = {};
    avg['dataname'] = dataname;
    avg['dbname'] = dbname;
    avg['datapath'] = datapath;
    avg['evalnum'] = evalnum;
    for(key in evalOpt){    
            result = await ceping.findAll({
            attributes:[[sequelize.fn('avg',sequelize.col(evalOpt[key])), 'avg'+evalOpt[key]]],
            raw: true,
            where: {
                dataname
            },
        });        
        avg['avg'+evalOpt[key]] = result[0]['avg'+evalOpt[key]]
    }
    return avg;
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
// 输入：useraccount
// 输出：tar = {dataname, dbname, datapath}
exports.randone = async function (useraccount) {
    if(useraccount == undefined){// 未登录时随机一条数据
        var {dataname, dbname, datapath} = await data.findOne({
            attributes: ['dataname', 'dbname', 'datapath'],
            order: [sequelize.literal('rand()')]
        });
        console.log(useraccount);
        return {dataname, dbname, datapath};
    }
    else{// 随机一条用户没有测评过的数据
        do{
            var {dataname, dbname, datapath} = await data.findOne({
                attributes: ['dataname', 'dbname', 'datapath'],
                order: [sequelize.literal('rand()')]
            });
            var targetcepingid = await ceping.findOne({
                attributes: ['id'], // 指定返回字段
                where:{
                    dataname,
                    useraccount
                }
            }); 
        }
        while(targetcepingid != null);
        
        return {dataname, dbname, datapath};
    }
    
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

// 查询指定数据库所有数据
// 输入：dbname
// 输出：{rows, count}
exports.listByDbname = async function (dbname, page = 1, size = 10) {
    return data.findAndCountAll({
        attributes: ['dataname', 'dbname', 'datapath', 'evalnum'],
        where: {
            dbname,
        },
        limit: size,
        offset: (page - 1) * size,
        order: [['evalnum', 'DESC']],
    });
};
