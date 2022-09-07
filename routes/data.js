// 数据模块
const Router = require('koa-router');
const dataService = require('../services/data');
const cepingService = require('../services/ceping');
const guard = require('../middlewares/guard');
const router = new Router({prefix: '/data'});

// 发布数据（管理员）
//::todo

// 读取数据（包含相关测评）
router.get('/show/:id', async (ctx) => {
    let {page = 1, size = 10} = ctx.query;
    page = Number(page);
    size = Number(size);
    // 读取数据
    const dataId = ctx.params.id;
    const targetData = await dataService.show(dataId);
    if (!targetData) {
        throw new Error('数据不存在');
    }
    // 读取测评
    const {rows: cepings, count} = await cepingService.listByData(dataId, page, size);
    await ctx.render('data/show', {
        targetData,
        cepings,
        count,
        page,
        size
    });
});

//数据页
router.get('/dataManage', async (ctx) => {
    await ctx.render('/data/dataManage');
});



router.get('/dataManageDetail', async (ctx) => {
    await ctx.render('/data/dataManageDetail');
});

module.exports = router;
