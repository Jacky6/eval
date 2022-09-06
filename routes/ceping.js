// 测评模块
const allocation = require('../alloction');
const Router = require('koa-router');
const cepingService = require('../services/ceping');
const guard = require('../middlewares/guard');
const router = new Router({prefix: '/ceping'});

// 添加或更新测评 （提交一条测评）
// :todo
router.post('/update', guard, async (ctx) => {
    const {dataname, useraccount, comment, index} = ctx.request.body;   // index 是测评结果数组
    await cepingService.publish(dataname, useraccount, comment, index);
    await ctx.redirect('/');
}); 

// 删除测评
router.get('/delete/:id', guard, async (ctx) => {
    const useraccount = ctx.state.useraccount;
    await dataService.destroy(ctx.params.id, useraccount);
    await ctx.redirect('back');
});


module.exports = router;
