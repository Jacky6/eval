// service-api 测试文件
const dataService = require('./data');
const UserService = require('./user');
const evaluationService = require('./evaluation');

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
            const result2 = await dataService.show('1 copy 3.wav');
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
    obj = {'index1':1};
    switch(d) {
        case 1:{
            console.log('添加或更新测试');
            const result1 = await evaluationService.publish('1.wav','zhengzhi',obj);
            console.log(result1);
        }
        break;
        case 2:{
            console.log('假删除测试');
            const result2 = await evaluationService.destroy(1, 'zzc12345');
            console.log(result2);
        }
        break;
        case 3:{
            console.log('查看 指定数据 测评列表 测试');
            const result3 = await evaluationService.listByData('1.wav', 1, 10);
            console.log(result3);
        }
        break;
        case 4:{
            console.log('查看 指定用户 测评列表 测试');
            const result4 = await evaluationService.listByUser('zhengzhi','db1', 1, 1);
            console.log(result4);
        }
        break;
        case 5: {
            console.log('查看 指定测评 查询');
            const result5 = await evaluationService.listByDataAndUser('audio_1','zzc12345');
            console.log(result5);
        }
        break;
        case 6: {
            console.log('统计测评项区间数目');
            const result6 = await evaluationService.listByIndex('1 copy.wav','index2', 0, 5);
            console.log('6:',result6);
        }
    }
}

cepingtest(4);
