node_modules            项目依赖库
//后端
shared                  共享组件
middlewares kos         中间件
models                  模型定义(数据库)
db.js                   数据块建立文件
services                业务逻辑api
routes                  路由定义
//前端
templates               视图文件
public                  静态文件
//入口和配置文件
index.js                入口文件
package.json            包描述文件
allocation.js           自定义配置文件


使用说明：
1、安装node.js + mysql

2、克隆代码到本地
```
git clone 
```

3、安装依赖
```
node install
```

4、配置全局参数 allocation.js 
```
 设置测评选项

 设置数据库
```

5、同步数据库
```
node db.js
```

6、启动项目
```
node index.js
```
