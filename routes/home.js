// 首页模块
const Router = require('koa-router');
const router = new Router();
const dataService = require('../services/data');

router.get('/', async (ctx) => {
    let {page = 1, size = 10} = ctx.query;
    page = Number(page);
    size = Number(size);
    const {rows, count} = await dataService.list(page, size);
    await ctx.render('home', {
        list: rows,
        count,
        page: page,
        size: size
    });
});

module.exports = router;