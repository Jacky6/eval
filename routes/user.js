// 用户路由模块
const Router = require('koa-router');
const userService = require('../services/user');
const dataService = require('../services/data');
const evaluationService = require('../services/evaluation');
const guard = require('../middlewares/guard');
const router = new Router({prefix: '/user'});
const allocation = require('../alloction');

function formattime(timestr) {
    var timestamp = Date.parse(timestr);
    var date = new Date(timestamp);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD + " " + hh + mm + ss;
}

router.get('/login', async (ctx) => {
    await ctx.render('user/login');
});

router.post('/login', async (ctx) => {
    const {useraccount, password} = ctx.request.body;
    if (!useraccount || !password) {
        throw new Error('请填写完整!');
    }
    const user = await userService.login(useraccount, password);
    ctx.cookies.set('useraccount', user.useraccount, {
        signed: true,
        maxAge: 3600 * 24 * 1000,   // cookie 有效时长
    });
    await ctx.redirect('/');
});

router.get('/register', async (ctx) => {
    await ctx.render('user/register');
});

router.post('/register', async (ctx) => {
    const {useraccount, password, confirmPassword} = ctx.request.body;
    if (!useraccount || !password || !confirmPassword) {
        throw new Error('请填写完整!');
    }
    if (password !== confirmPassword) {
        throw new Error('确认密码不一致');
    }
    await userService.register(useraccount, password);
    await ctx.redirect('/user/login');
});

router.get('/logout', async (ctx) => {
    ctx.cookies.set('useraccount', '', {maxAge: 0});
    await ctx.redirect('/');
});

router.get('/personalInfo', async (ctx) => {
    const useraccount = ctx.state.useraccount;
    const evalOpt = allocation.evalOpt;
    const dbname = allocation.dbnames[0];
    page = 1;
    size = 10;
    var { rows, count } = await evaluationService.listByUser(useraccount, dbname ,page, size);
    const usernum = count;
    var personal_tar = [];
    for (key in rows) {
        var item = {};
        item['id'] = rows[key]['id'];
        item['dataname'] = rows[key]['dataname'];
        item['comment'] = rows[key]['comment'];
        item['createdAt'] = formattime(rows[key]['createdAt']);
        item['updatedAt'] = formattime(rows[key]['updatedAt']);

        var index_arr = [];
        for (key1 in evalOpt) {
            index_arr.push(rows[key][evalOpt[key1]]);
        };
        item['index_arr'] = index_arr;
        personal_tar.push(item);
    }

    var {rows, count} = await dataService.listByDbname(dbname);
    const datanum = count;
    
    await ctx.render('/user/personalInfo', {
        personal_tar: personal_tar,
        dbname: dbname,
        page_index: page,
        usernum: usernum,
        datanum: datanum,
    });
});


router.get('/personalInfo/:params', async (ctx) => {
    const params = ctx.params.params;
    const dbname = params.split("&")[0].split("=")[1];
    const page = params.split("&")[1].split("=")[1];
    const useraccount = ctx.state.useraccount;
    const evalOpt = allocation.evalOpt;
    const size = 10;
    console.log(dbname);

    var { rows, count } = await evaluationService.listByUser(useraccount, dbname, page, size);
    const usernum = count;
    var personal_tar = [];
    for (key in rows) {
        var item = {};
        item['id'] = rows[key]['id'];
        item['dataname'] = rows[key]['dataname'];
        item['comment'] = rows[key]['comment'];
        item['createdAt'] = formattime(rows[key]['createdAt']);
        item['updatedAt'] = formattime(rows[key]['updatedAt']);

        var index_arr = [];
        for (key1 in evalOpt) {
            index_arr.push(rows[key][evalOpt[key1]]);
        };
        item['index_arr'] = index_arr;
        personal_tar.push(item);
    }

    var {rows, count} = await dataService.listByDbname(dbname);
    const datanum = count;
    
    await ctx.render('/user/personalInfo', {
        personal_tar: personal_tar,
        dbname: dbname,
        page_index: page,
        datanum: datanum,
        usernum:usernum,
    });
});

// 删除一条测评
router.get('/delete/:cepingId', guard, async (ctx) => {
    const cepingId = ctx.params.cepingId;
    const useraccount = ctx.state.useraccount;
    await evaluationService.destroy(cepingId, useraccount);
    ctx.redirect('back');
});


module.exports = router;
