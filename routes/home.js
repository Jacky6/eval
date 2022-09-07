// 首页模块
const allocation = require('../alloction');
const Router = require('koa-router');
const router = new Router();
const guard = require('../middlewares/guard');
const dataService = require('../services/data');
const cepingService = require('../services/ceping');

router.get('/', async (ctx) => {
    const {dataname, dbname, datapath} = await dataService.randone();
    
    ctx.cookies.set('dataname', dataname, {
        signed: true,
        maxAge: 3600 * 24 * 1000,   // cookie 有效时长
    });

    await ctx.render('home', {
        dataname: dataname,
        dbname: dbname,
        datapath: datapath,
    });
});

//:提交测评
router.post('/', guard, async (ctx) => {
    const evalOpt = allocation.evalOpt;
    const obj = {};
    for(key in evalOpt){
        obj[evalOpt[key]] = ctx.request.body[evalOpt[key]];
    }
    const comment = ctx.request.body['comment'];
    if(comment != ''){
        obj['comment'] = comment;
    }
    const dataname = ctx.state.dataname;
    const useraccount = ctx.state.useraccount;
    await cepingService.publish(dataname, useraccount, obj);
    await ctx.redirect('back');
})


module.exports = router;
