// 测评模块
const Router = require('koa-router');
const cepingService = require('../services/ceping');
const guard = require('../middlewares/guard');
const router = new Router({prefix: '/ceping'});


// 删除测评
router.get('/delete/:id', guard, async (ctx) => {
    const userId = ctx.state.userId;
    await dataService.destroy(ctx.params.id, userId);
    await ctx.redirect('back');
});


module.exports = router;
