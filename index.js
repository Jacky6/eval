const Koa = require('koa');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const staticMiddleware = require('koa-static');
const errorHandler = require('./middlewares/errorHandler');
const authenticate = require('./middlewares/authenticate');
const homeRoute = require('./routes/home');
const userRoute = require('./routes/user');
const dataRoute = require('./routes/data');
const evaluationRoute = require('./routes/evaluation');

const app = new Koa({
    keys:['KGJ6NLxqOkYCNr1h']   //加密字串
})

// 中间件
app.use(errorHandler);
render(app, { // 使用ejs中间件
    root: './templates', // 模板目录
    layout: false, // 关闭模板布局
    viewExt: 'ejs'  // 渲染引擎
});

app.use(staticMiddleware(__dirname + '/public'));   // 样式文件 和 数据 目录
app.use(bodyParser());
app.use(authenticate);

//路由
app.use(homeRoute.routes()).use(homeRoute.allowedMethods());
app.use(userRoute.routes()).use(userRoute.allowedMethods());
app.use(dataRoute.routes()).use(dataRoute.allowedMethods());
app.use(evaluationRoute.routes()).use(evaluationRoute.allowedMethods());

app.listen(8080, () => {
    console.log('listen on 8080')
});




