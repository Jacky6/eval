// service-api 测试文件
const dataService = require('./data');
const UserService = require('./user');
const cepingService = require('./ceping');

// 用户接口测试
async function usertest (d) {
    switch(d){
        case 1:{
            console.log('注册测试');
            const result1 = await UserService.register('zzc12345', '12345678');
            console.log(result1);
        }
        case 2:{
            console.log('登录测试');
            const result2 = await UserService.login('zzc12345', '12345678');
            console.log(result2);
            const result3 = await UserService.login('zzc12345', '12345678');
            console.log(result3);
        }
        case 3:{
            console.log('查看测试');
            const result4 = await UserService.show('zzc12345');
            console.log(result4);
        }
        break;
    }
}

// 数据接口测试
async function datatest (d,obj) {
    switch(d) {
        case 1:{
            console.log('添加数据测试');
            const result1 = await dataService.publish(obj);
            console.log(result1);
        }
        break;
        case 2:{
            console.log('查询一条数据');
            const result2 = await dataService.show('audio_1');
            console.log(result2);
        }
        break;
        case 3:{
            console.log('所有数据')
            const result3 = await dataService.list();
            console.log(result3);
        }
        break;
    }

}


// 测评接口测试
async function cepingtest (d) {
    const index = [1,2,3];
    switch(d) {
        case 1:{
            console.log('添加或更新测试');
            const result1 = await cepingService.publish('audio_1','zzc12345',index);
            console.log(result1);
        }
        break;
        case 2:{
            console.log('假删除测试');
            const result2 = await cepingService.destroy(1, 'zzc12345');
            console.log(result2);
        }
        break;
        case 3:{
            console.log('查看 指定数据 测评列表 测试');
            const result3 = await cepingService.listByData('audio_1', 1, 10);
            console.log(result3);
        }
        break;
        case 4:{
            console.log('查看 指定用户 测评列表 测试');
            const result4 = await cepingService.listByUser('zzc12345', 1, 10);
            console.log(result4);
        }
        break;
        case 5: {
            console.log('查看 指定测评 查询');
            const result5 = await cepingService.listByDataAndUser('audio_1','zzc12345');
            console.log(result5);
        }
        break;
    }
}

obj = [{
    dataname: '3.wav',
    dbname: 'sounds',
    datapath: 'D:\\projects\\vue\\sounds\\3.wav'
  },
  {
    dataname: '1.wav',
    dbname: 'sounds',
    datapath: 'D:\\projects\\vue\\sounds\\1.wav'
  },
  {
    dataname: '4.wav',
    dbname: 'sounds',
    datapath: 'D:\\projects\\vue\\sounds\\4.wav'
  },
  {
    dataname: '2.wav',
    dbname: 'sounds',
    datapath: 'D:\\projects\\vue\\sounds\\2.wav'
  }];

datatest(1,obj);

