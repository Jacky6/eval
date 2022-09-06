// 用户相关业务
const sequelize = require('../shared/sequelize');
const User = sequelize.import('../models/user');

// 注册账号
exports.register = async function (useraccount, password) {
    const user = await User.findOne({
        where: {useraccount},
    });
    if (user !== null) {
        throw new Error("账号已存在");
    }
    nickname = 'defaultname';
    return User.create({
        useraccount,
        password,
        nickname
    });
};
// 登录
exports.login = async function login(useraccount, password) {
    const user = await User.findOne({
        where: {useraccount}
    });
    if (user === null || !user.checkPassword(password)) {
        throw new Error('账号或密码错误');
    }
    return user;
};
// 查看用户信息
exports.show = function (useraccount) {
    return User.findByPk(useraccount, {
        attributes: ['useraccount', 'nickname', 'evalnum']
    });
};
// 修改个人资料
exports.changeProfile = function (useraccount, nickname, password) {
    return User.update({nickname, password: password || ''}, {where: {useraccount: useraccount}, individualHooks: true});
};

//  用户测评数目加一
exports.addevalnum = async function (useraccount){
    const targetuser = await User.findOne({
        where:{
            useraccount,
        }
    });
    targetuser.evalnum = targetuser.evalnum + 1;
    return await targetuser.save();
}

//  用户测评数目减一
exports.delevalnum = async function (useraccount){
    const targetuser = await User.findOne({
        where:{
            useraccount,
        }
    });
    targetuser.evalnum = targetuser.evalnum - 1;
    return await targetuser.save();
}