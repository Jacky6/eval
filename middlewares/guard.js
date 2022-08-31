//  登录守卫，未登录用户将直接重定向到登录页
//  检测ctx.state.account，如果为0则强制重定向到登录页，以保证需要登录来确认访问的页面权限
module.exports = async function (ctx, next) {
    if (!ctx.state.useraccount) {
        await ctx.redirect('/user/login');
        return;
    }
    await next();
};
