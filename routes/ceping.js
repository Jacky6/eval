// 测评模块
const Router = require('koa-router');
const cepingService = require('../services/ceping');
const guard = require('../middlewares/guard');
const router = new Router({prefix: '/ceping'});


// 添加或更新测评
// :todo

// 

// 删除测评
router.get('/delete/:id', guard, async (ctx) => {
    const useraccount = ctx.state.useraccount;
    await dataService.destroy(ctx.params.id, useraccount);
    await ctx.redirect('back');
});


module.exports = router;
