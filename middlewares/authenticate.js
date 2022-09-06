//  用户登录验证
//  读取cookie中的userId字段，并挂载到ctx.state.userId上。
//  未登录用户的userId设置为0，不会强制重定向到登录页，保证一些允许登录用户或未登录用户业务的正常使用
module.exports = async function (ctx, next) {
    ctx.state.useraccount = ctx.cookies.get('useraccount', {signed: true});
    ctx.state.dataname = ctx.cookies.get('dataname', {signed: true});
    await next();
};
