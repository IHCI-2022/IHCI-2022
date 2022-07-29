var apiPrefix = {

};

var secretMap = {

};

var config = {
    'debug': false,

    resTime: 0,

    // 请求超时配置
    'requestTimeout': 10000,

    // 默认服务端口
    'serverPort': 80,

    // 实例开启个数（在开启cluster模式下有效）
    'clusterCount': 8,

    // redis
    'redisConf': {
        'port': 6379,
        'host': '127.0.0.1',
        'no_ready_check': true,
        // 'password': 'WdPTMj6X',
    },
    'redisExpire': 60 * 60 * 24,

    'webAppId': 'wx50a231aefaff3222',
    'webAppSe': '4aa16e1583e8525a4d4bb47b37928467',

    'pubAppId': 'wx87136e7c8133efe3',
    'pubAppSe': '195592b5e345046e61b5efc33d4cb42d',

    'ossConf': {
        'ossAdminAccessKeyId': 'LTAI5tKBcAv56SWfAPrgkdJ8',
        'ossAdminAccessKeySecret': 'ZVY6PQXabeIui1E2KEI6LcZzBD3hgn',

        'accessKeyId': 'LTAI5tF1hokanRXRW9SuAJLw',
        'accessKeySecret': 'FVBZdM5UlvCISAWBdgBTiWL1jDkSc8',
        'roleArn': 'acs:ram::1833862883896167:role/aliyunosstokengeneratorrole',
        'region': 'oss-cn-beijing',
        'bucket': 'ihci',
    },

    sysAppId: 'LTAIHdOovdo1ddVO',
    sysAppSe: '6buiD9zXaOtKSLAWOQdHks390Cg9xe',

    mailOrigin: 'http://localhost:5000',
    mail: {
        host: 'smtp.163.com', 
        port: 25,
        auth: {
            user: 'ihci2018@163.com', //注册的邮箱账号
            pass: 'ihci2018'  //邮箱的授权码，不是注册时的密码
        }
    },

    db: 'mongodb://127.0.0.1:27017/ihci',

    'lruMaxAge': 3600000,
    'lruMax': 500,

    // 用于本地存储日志
    'logs': '/logs/logs.log',

    // 文件上传配置
    'upload': {
        'maxSize': 5242880,
        'maxPatientCount': 50,
    },

    // 客户端公参接收配置
    'client_params_keys': ['caller', 'os', 'ver', 'platform', 'userId', 'sid'],
};

module.exports = config;
module.exports.apiPrefix = apiPrefix;
module.exports.secretMap = secretMap;
