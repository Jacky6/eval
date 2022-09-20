// 首页模块
const allocation = require('../alloction');
const Router = require('koa-router');
const router = new Router();
const guard = require('../middlewares/guard');
const dataService = require('../services/data');
const evaluationService = require('../services/evaluation');

router.get('/', async (ctx) => {
    ctx.state.full = 0;
    useraccount = ctx.state.useraccount;
    if(useraccount != undefined){
        ret1 = await evaluationService.listByUser(useraccount);
        usernum = ret1['count'];
        ret2 = await dataService.list();
        datanum = ret2['count'];
        if(usernum == datanum){
            tar = await dataService.randone();
            ctx.state.full = 1;
        }
        else{
            tar = await dataService.randone(useraccount);
        }
    }
    else{
        tar = await dataService.randone(useraccount);
    }
    const dataname = tar['dataname'];
    const dbname = tar['dbname'];
    const datapath = tar['datapath'];
    
    ctx.cookies.set('dataname', new Buffer.from(dataname).toString('base64'), {
    signed: true,
    maxAge: 3600 * 24 * 1000,   // cookie 有效时长
    });

    ctx.state.flag = ctx.cookies.get('flag');
    ctx.cookies.set('flag', 0, {
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
    const dataname = new Buffer.from(ctx.state.dataname, 'base64').toString();
    const useraccount = ctx.state.useraccount;
    await evaluationService.publish(dataname, useraccount, obj);
    
    ctx.cookies.set('flag', 1, {
        signed: true,
        maxAge: 3600 * 24 * 1000,   // cookie 有效时长
    });
    ctx.state.flag = ctx.cookies.get('flag');
    ctx.redirect('back');
})


module.exports = router;
