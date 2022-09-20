// 数据测评
const allocation = require('../alloction');
const sequelize = require('../shared/sequelize');
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op

const dataService = require('./data');
const userService = require('./user');

const evaluation = sequelize.import('../models/evaluation');
const data = sequelize.import('../models/data');
const User = sequelize.import('../models/user');

const evalOpt = allocation.evalOpt;

// 测评一条数据
// 输入：dataname:数据名称 useraccount：用户账号 obj：字典{indexi:indexi,...,comment:'comment'}
exports.publish = async function (dataname, useraccount, obj) {
    const targetdata = await dataService.show(dataname);
    if (targetdata === null) {
        throw new Error('数据',dataname,'不存在');
    }

    const targetuser = await User.findByPk(useraccount);
    if(targetuser === null) {
        throw new Error('用户',useraccount,'不存在');
    }

    const targetcepingid = await evaluation.findOne({
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
        return evaluation.create(obj);
    }
    else{//更新测评结果
        return evaluation.update(obj,{
            where:{
                dataname,
                useraccount
            }
        });
    }
};

// 删除一条测评(假删除)
exports.destroy = async function (cepingId, useraccount) {
    const target = await evaluation.findByPk(cepingId);
    if (target === null || target.useraccount !== useraccount) {
        throw new Error('你无权删除该评论');
    }
    return target.destroy();
};


// 查看指定数据测评列表
// 输入： datanaem，page（），size(一页大小)
// 输出：{ count(总数)，rows(第page页全部) }
exports.listByData = async function(dataname, page=1, size=1) {
    var tar = [];
    tar.push('id');
    tar.push('dataname');
    for(key in evalOpt){
        tar.push(evalOpt[key]);
    }
    tar.push('comment');
    tar.push('createdAt');
    tar.push('updatedAt');
    return evaluation.findAndCountAll({
        attributes: tar,
        where: {dataname},
        offset: (page-1) * size,
        limit: size,
        order: [['id','DESC']]
    })
};

// 查看 指定用户和指定数据集 的 测评列表
// 输入： useraccount, dbname, page（），size(一页大小)
// 输出：{ count(总数)，rows(第page页全部) }
exports.listByUser = async function(useraccount, dbname='none', page=1, size=1) {
    var tar = [];
    tar.push('id');
    tar.push('dataname');
    for(key in evalOpt){
        tar.push(evalOpt[key]);
    }
    tar.push('comment');
    tar.push('createdAt');
    tar.push('updatedAt');
    if(dbname === 'none'){
        return await evaluation.findAndCountAll({
            attributes: tar,
            where: {useraccount},
            include: [{
                model: data,
            }],
            offset: (page-1) * size,
            limit: size,
            order: [['id','DESC']]
        })
    }
    return await evaluation.findAndCountAll({
        attributes: tar,
        where: {useraccount},
        include: [{
            model: data,
            where: {
                dbname,
            },
        }],
        offset: (page-1) * size,
        limit: size,
        order: [['id','DESC']]
    })
    
};

// 查看 指定用户 和 指定数据 的测评结果
// 输入： dataname, 用户账号，page（），size(一页大小)
// 输出：{ count(总数)，rows(第page页全部) }
exports.listByDataAndUser = async function(dataname, useraccount) {
    var tar = [];
    tar.push('id');
    tar.push('dataname');
    for(key in evalOpt){
        tar.push(evalOpt[key]);
    }
    tar.push('comment');
    tar.push('createdAt');
    tar.push('updatedAt');
    return evaluation.findOne({
        attributes: tar,
        where: {
            dataname,
            useraccount
        }
    })
}

// 按 测评项 区间统计测评条数
// 输入：dbname, index(测评项), [down, up](上下限)
// 输出：{rows, count}
exports.listByIndex = async function(dataname, index, down=0, up=5){
    return await evaluation.findAndCountAll({
        where: {dataname, 
            index1: {
                [Op.between]:[down, up],
            }},
    })
}





