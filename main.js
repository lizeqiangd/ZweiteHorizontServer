console.log('ZweiteHorizont System Starting.....');

//modules....
var net = require('net');
var nshen = require("./net/ObjectSocket/ObjectSocket.js");
var phpapi = require('./net/PHPAPI/PHPAPI.js');
var utils = require('./api/utils.js');
//var process = require('process');

//level 5 function.
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
utils.main();
var listen_port = 20100;
var timeout_limit = 10000;

console.log('ZweiteHorizont System Level 5 functions initialization completed!');
//level 4 function.
var api = {
    utils: utils,
    connection_manager: require('./api/ConnectionManager.js'),
    communication_manager: require('./api/CommunicationManager.js'),
    system_manager: require('./api/SystemManager.js'),
    end: 0
}

api.connection_manager.config_system(api);
api.communication_manager.config_system(api);
api.system_manager.config_system(api);
var MainServer = net.createServer(function (socket) {
    //初始化连接.
    var oSocket = new nshen.ObjectSocket(socket);
    oSocket.sendObject({msg: 'Welcome to ZweiteHorizont test server ,please check your accree token.'});

    //当完整的数据包抵达时反馈的事件.
    oSocket.on('data', function (obj) {
        obj.connection = oSocket;
        onDataIncoming(obj);
    });

    //连接关闭.
    socket.on('close', function () {
        api.connection_manager.remove_connection_from_server(oSocket);
        //onUserDisconnected(oSocket);
    });

    //连接发生错误
    socket.on('error', function () {
        console.log('client error');
    });

    socket.on('lookup', function () {
        //console.log('client lookup');
    });
    socket.on('end', function () {
        //console.log('client end');
    });
    socket.on('timeout', function () {
        console.log('client timeout');
    });
    socket.on('drain', function () {
        //console.log('client drain');
    });
});
console.log('ZweiteHorizont System Level 4 functions initialization completed!');
MainServer.listen(listen_port, function () {
    console.log('ZweiteHorizont SystemService Started, socket service listening on ' + listen_port);
});
//**************************************************************************************************************

/**
 * obj为发送过来的整个obj包
 * obj.connection 为发这个包的oSocket
 * obj.connection.sendObject({})
 * @param obj
 */
function onDataIncoming(obj) {
    if (obj.close == 1) {
        obj.connection.closeConnection();
        return;
    }
    try {
        api[obj.module][obj.action](obj);
    } catch (e) {
        console.log('onDataIncoming:[' + obj.module + '][' + obj.action + '] error');
        console.log(e);
        return;
    }
}
