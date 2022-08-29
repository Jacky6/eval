// 用户路由模块
const Router = require('koa-router');
const userService = require('../services/user');
const dataService = require('../services/data');
const guard = require('../middlewares/guard');
const router = new Router({prefix: '/user'});

router.get('/login', async (ctx) => {
    await ctx.render('user/login');
});

router.post('/login', async (ctx) => {
    const {username, password} = ctx.request.body;
    if (!username || !password) {
        throw new Error('请填写完整!');
    }
    const user = await userService.login(username, password);
    ctx.cookies.set('userId', user.id, {
        signed: true,
        maxAge: 3600 * 24 * 1000
    });
    await ctx.redirect('/');
});

router.get('/register', async (ctx) => {
    await ctx.render('user/register');
});

router.post('/register', async (ctx) => {
    const {username, password, confirmPassword} = ctx.request.body;
    if (!username || !password || !confirmPassword) {
        throw new Error('请填写完整!');
    }
    if (password !== confirmPassword) {
        throw new Error('确认密码不一致');
    }
    await userService.register(username, password);
    await ctx.redirect('/user/login');
});

router.get('/logout', async (ctx) => {
    ctx.cookies.set('userId', null, {maxAge: 0});
    await ctx.redirect('/');
});

router.get('/home', guard, async (ctx) => {
    const {page = 1, size = 10} = ctx.query;
    const {rows, count} = await dataService.listByUser(ctx.state.userId, page, size);
    await ctx.render('user/home', {
        list: rows,
        count,
        page: Number(page),
        size: Number(size)
    });
});

router.get('/homepage/:id', async (ctx) => {
    const {page = 1, size = 10} = ctx.query;
    const {rows, count} = await dataService.listByUser(ctx.params.id, page, size);
    await ctx.render('user/homepage', {
        list: rows,
        count,
        page: Number(page),
        size: Number(size)
    });
});

router.get('/profile', guard, async (ctx) => {
    const user = await userService.show(ctx.state.userId);
    await ctx.render('user/profile', {
        user
    });
});

router.post('/profile', guard, async (ctx) => {
    const {nickname, password} = ctx.request.body;
    if (!nickname || nickname.length > 20) {
        throw new Error('昵称不合法');
    }
    await userService.changeProfile(ctx.state.userId, nickname, password);
    await ctx.redirect('/user/home');
});

module.exports = router;
