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
var oSocket;
console.log('ZweiteHorizont System Level 5 functions initialization completed!');
//level 4 function.

var api = {
    connection_manager: require('./api/ConnectionManager.js'),
    system_manager: require('./api/SystemManager.js'),
    end: 0
}

var MainServer = net.createServer(function (socket) {

    //初始化连接.
    oSocket = new nshen.ObjectSocket(socket);
    onUserConnected(oSocket);

    //当完整的数据包抵达时反馈的事件.
    oSocket.on('data', function (obj) {
        obj.connection = oSocket;
        onDataIncoming(obj);
    });

    //连接关闭.
    socket.on('close', function () {
        onUserDisconnected(oSocket);
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

//main system start.
MainServer.listen(listen_port, function () {
    console.log('ZweiteHorizont SystemService Started, socket service listening on ' + listen_port);
});
//**************************************************************************************************************

//直接连接socket调度
function onUserConnected(oSocket) {
    //ConnectionService.AddConnectionToService(oSocket);
    oSocket.sendObject({msg: 'Welcome to ZweiteHorizont test server.'});
}

//直接断开socket调度
function onUserDisconnected(oSocket) {
    api.connection_manager.remove_connection_from_server(oSocket);
    //ConnectionService.RemoveConnectionFromService(oSocket);
    console.log('A client disconnected. now connections:'+  api.connection_manager.get_connection_count());

}

/**
 * obj为发送过来的整个obj包
 * obj.connection 为发这个包的oSocket
 * oSocket.sendObject({})
 * @param obj
 */
function onDataIncoming(obj) {
    if (isValidDataObject(obj)) {
        if (obj.close == 1) {
            obj.connection.closeConnection();
            return;
        }
        api[obj.module][obj.action](obj);
        return;
        try {
            api[obj.module][obj.action](obj);
        } catch (e) {
            console.log('onDataIncoming:can not find', obj.module, ':', obj.action,e);
            return;
        }
    }
}
/**
 * 通过验证包内是否函数3个属性来确定这个包是否有效.
 * @param obj
 * @returns {boolean}
 */
function isValidDataObject(obj) {
    if (!obj.client_id) {
        obj.connection.sendObject({msg: 'no client_id.'});
        return false;
    }
    if (!obj.module) {
        obj.connection.sendObject({msg: 'no module.'});
        return false;
    }
    if (!obj.timestamp) {
        obj.connection.sendObject({msg: 'no timestamp.'});
        return false;
    }
    return true;
}

function getPushObject() {

}

function saveBadObject(obj) {

}
