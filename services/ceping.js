// 数据测评
const allocation = require('../alloction');
const sequelize = require('../shared/sequelize');
const dataService = require('./data');
const userService = require('./user');

const ceping = sequelize.import('../models/ceping');
const User = sequelize.import('../models/user');

const evalOpt = allocation.evalOpt;

// 测评一条数据
//:para 
//dataname:数据名称 useraccount：用户账号
//obj：字典{indexii:indexi,...,comment:'comment'}
exports.publish = async function (dataname, useraccount, obj) {
    const targetdata = await dataService.show(dataname);
    if (targetdata === null) {
        console.log(dataname);
        throw new Error('数据不存在');
    }

    const targetuser = await User.findByPk(useraccount);
    if(targetuser === null) {
        console.log(useraccount);
        throw new Error('用户不存在');
    }

    const targetcepingid = await ceping.findOne({
        attributes: ['id'], // 指定返回字段
        where:{
            dataname,
            useraccount
        }
    }); 

    if(targetcepingid === null){    // 添加测评结果
        obj['useraccount'] = useraccount;
        obj['dataname'] = dataname;
        dataService.addevalnum(dataname);
        userService.addevalnum(useraccount);
        return ceping.create(obj);
    }
    else{//更新测评结果
        console.log(obj);
        return ceping.update(obj,{
            where:{
                dataname,
                useraccount
            }
        });
    }
};

// 删除一条测评(假删除)
exports.destroy = async function (cepingId, useraccount) {
    const target = await ceping.findByPk(cepingId);
    if (target === null || target.useraccount !== useraccount) {
        throw new Error('你无权删除该评论');
    }
    return target.destroy();
};


// 查看指定数据测评列表
exports.listByData = async function(dataname, page, size) {
    return ceping.findAndCountAll({
        where: {dataname},
        offset: (page-1) * size,
        limit: size,
        order: [['id','DESC']]
    })
};

// 查看 指定用户 的 测评列表
exports.listByUser = async function(useraccount, page, size) {
    return ceping.findAndCountAll({
        where: {useraccount},
        offset: (page-1) * size,
        limit: size,
        order: [['id','DESC']]
    })
};

// 查看 指定用户 和 指定数据 的测评结果
exports.listByDataAndUser = async function(dataname, useraccount) {
    return ceping.findOne({
        where:{
            dataname,
            useraccount
        }
    })
}






