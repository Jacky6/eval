// 错误处理器
//  系统发生错误时，渲染错误页面。
module.exports = async function (ctx, next) {
    try {
        await next();
    } catch (e) {
        await ctx.render('error', {
            error: e.message,
            title: '错误'
        });
    }
};
