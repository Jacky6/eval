const path = require('path');
const fs = require('fs');
const sequelize = require('./shared/sequelize');
sequelize.import('./models/data');
sequelize.import('./models/user');
sequelize.import('./models/evaluation');
const dataService = require('./services/data');
const allocation = require('./alloction');

// 数据库建立 
async function CreateDatabase() {
    return await sequelize.sync({force: true}).catch((err) => console.error(err)).finally();//() => sequelize.close());
}

// 待测评数据库录入
async function PushData(dbname, dbpath) {
    // 获取参数
    const isFile = filename => {
        return fs.lstatSync(filename).isFile();
    }

    dataname = fs.readdirSync(dbpath);
    datapath = dataname.map( filename => {
        return path.join(dbpath,filename);
    }).filter(isFile);
    for(key in datapath){
        datapath[key] = datapath[key].replace('public\\','')
    }
    obj = [];
    for (key in datapath) {
        obj[key] = {'dataname': dataname[key],
                    'dbname': dbname,
                    'datapath': datapath[key],
                    'evalnum': 0
                }
    }
    console.log(obj);
    // 导入数据
    dataService.publish(obj);
}


// 主函数
async function main() {
    // 创建数据库
    await CreateDatabase();
    // 导入待测评数据
    for(key in allocation.dbnames){
        const dbpath = allocation.dbpaths[key];
        const dbname = allocation.dbnames[key];
        await PushData(dbname, dbpath);
    }
}

main();