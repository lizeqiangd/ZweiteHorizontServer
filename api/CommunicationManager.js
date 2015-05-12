var phpapi = require('../net/PHPAPI/PHPAPI.js');
var utils = require('./utils.js');

/**
 * This is a class of ZweiteHorizont Server.
 * CommunicationManager
 * 功能不允许做的复杂,只完成魔兽世界级别的语言交互.
 * error code start at 300.
 */

/**
 * 信息通道的实例
 * @param obj
 */
function class_channel_instance(obj) {
    var channel_id = 0;
    var creator_uid = 0;
    var creator_name = '';
    var channel_name = '';
    var channel_secure_level = '';
    var channel_type = '';
    var channel_user_limit = '';
    var channel_administrator = '';
    var channel_description = '';
    var connection_pool = [];
    if (obj) {
        this.creator_uid = obj.uid + 0;
        this.creator_name = obj.display_name + '';
        this.channel_name = obj.channel_name + '';
        this.channel_secure_level = obj.channel_secure_level + '';
        this.channel_type = obj.channel_type + '';
        this.channel_user_limit = obj.channel_user_limit + '';
        this.channel_administrator = obj.channel_administrator + '';
        this.channel_description = obj.channel_description + '';
    }
}
/**
 * 总聊天频道数量.
 * @type {number}
 */
var num_channel = 0;
/**
 * 有所有信息通道的实例
 * @type {Array}
 */
var message_channel_pool = [];
/**
 * 所有信息通道的log信息.直接数组以及50条..
 * @type {Array}
 */
var message_channel_log=[];
var system_api = {};
var self = {
    config_system: function (obj) {
        system_api = obj
    },
    /**
     * 测试全局广播
     * @param obj
     */
    test_boardcast_message: function (obj) {
        var pool = system_api.connection_manager.get_connection_pool()
        var robj = system_api.utils.get_return_object(obj);
        robj.data = obj.data
        for (var i = 0; i < pool.length; i++) {
            pool[i].send_object(robj);
        }
        console.log('CommunicationManager:', obj.client_id, 'has boardcast a message');
    },
    /**
     * 获取对象列表
     * @param obj
     */
    list_message_channel: function (obj) {
        var robj = system_api.utils.get_return_object(obj);
        obj.data.limit = obj.data.limit ? obj.data.limit : 30;
        obj.data.page = obj.data.page ? obj.data.page : 1;
        robj.data.message_channels = [];
        for (var i = obj.data.limit * (obj.data.page - 1); i < obj.data.limit * obj.data.page; i++) {
            if (message_channel_pool[i]) {
                robj.data.message_channels.push(message_channel_pool[i]);
            } else {
                break;
            }
        }
        obj.connection.send_object(robj);
    },
    /**
     * 创建一个新的信息通道.
     * @param obj
     */
    creator_message_channel: function (obj) {
        var channel_instance = new class_channel_instance(obj.data)
        channel_instance.channel_id = ++num_channel;
        message_channel_pool[channel_instance.channel_id] = channel_instance;
        message_channel_log[channel_instance.channel_id]=[];
        var robj = system_api.utils.get_return_object(obj);
        robj.data = channel_instance;
        obj.connection.send_object(robj);
    },
    /**
     * 加入一个信息通道.
     * 成功200
     * 失败301
     * @param obj
     */
    join_message_channel: function (obj) {
        var robj = system_api.utils.get_return_object(obj);
        if (message_channel_pool[obj.data.channel_id]) {
            message_channel_pool[obj.data.channel_id]['connection_pool'].push(obj.connection.client_id);
            robj['channel_information'] = message_channel_pool[obj.data.channel_id];
            robj['message_log']=message_channel_log[obj.data.channel_id];
            robj['code'] = 200;
            obj.connection.send_object(robj)
        } else {
            robj['code'] = 301;
            robj['message'] = 'message channel not exist.';
            obj.connection.send_object(robj);
        }
    },
    /**
     * 离开一个信息通道.
     * 成功200
     * 失败302
     * @param obj
     */
    leave_message_channel: function (obj) {
        var robj = system_api.utils.get_return_object(obj);
        if (message_channel_pool[obj.data.channel_id]) {
            robj.code = 302;
            for (var i in message_channel_pool[obj.data.channel_id]['connection_pool']) {
                if (message_channel_pool[obj.data.channel_id]['connection_pool'][i] == obj.connection.client_id) {
                    message_channel_pool[obj.data.channel_id]['connection_pool'].splice(i, 1);
                    robj.code = 200;
                }
            }
            obj.connection.send_object(robj)
        } else {
            robj['code'] = 302;
            robj['message'] = 'message channel not exist.';
            obj.connection.send_object(robj);
        }
    },
    /**
     * 修改一个信息通道.
     * 成功200
     * 失败303
     * @param obj
     */
    edit_message_channel: function (obj) {
        var robj = system_api.utils.get_return_object(obj);
        if (message_channel_pool[obj.data.channel_id] && message_channel_pool[obj.data.channel_id].creator_uid == obj.data.creator_uid) {
            var mc = message_channel_pool[obj.data.channel_id];
            mc.channel_name = obj.data.channel_name;
            mc.channel_secure_level = obj.data.channel_secure_level;
            mc.channel_type = obj.data.channel_type;
            mc.channel_user_limit = obj.data.channel_user_limit;
            mc.channel_administrator = obj.data.channel_administrator;
            mc.channel_description = obj.data.channel_description;
            robj['code'] = 200;
            obj.connection.send_object(robj)
        } else {
            robj['code'] = 303;
            robj['message'] = 'message channel not exist.';
            obj.connection.send_object(robj);
        }
    },
    /**
     * 管理一个房间,包括踢人等操作.
     * @param obj
     */
    admin_message_channel: function (obj) {
        var robj = system_api.utils.get_return_object(obj);
        if (message_channel_pool[obj.data.channel_id]) {
            message_channel_pool[obj.data.channel_id]['connection_pool'].push(obj.connection.client_id);
            robj['channel_information'] = message_channel_pool[obj.data.channel_id];
            robj['code'] = 200;
            obj.connection.send_object(robj)
        } else {
            robj['code'] = 301;
            robj['message'] = 'message channel not exist.';
            obj.connection.send_object(robj);
        }
    },
    send_message_to_channel: function (obj) {
        var robj = system_api.utils.get_return_object(obj);
        if(check_client_id_in_channel(obj.connection.client_id,obj.data.channel_id)){
            var message='';
            message='['+obj.data.display_name+']:'+obj.data.message;
            boardcast_message_to_channel(message,obj.data.channel_id);
        }
    }
}
/**
 * 把发送到聊天频道的信息广播出去.
 * 广播数据包:
 * module=communication_manager
 * action=message_channel_boardcast
 * @param message
 * @param channel_id
 */
function boardcast_message_to_channel(message,channel_id) {
    message_channel_log[channel_id].push(message)
    while(message_channel_log[channel_id].length>50){
        message_channel_log[channel_id].splice(message_channel_log[channel_id].length-1,1);
    }
    var robj = system_api.utils.get_return_object({});
    robj.module='communication_manager'
    robj.action='message_channel_boardcast'
    robj.data={}
    robj.data.channel_id=channel_id;
    robj.data.message=message;
    for(var i=0;i<message_channel_log[channel_id]['connection_pool'].length;i++){
        system_api.connection_manager.find_connection(message_channel_log[channel_id]['connection_pool'][i],'client_id','socket').send_object(robj);
    }
}
/**
 * 当信息通道的参数发生更变的时候会发送广播信息出去.
 */
function channel_information_update() {

}
/**
 * 检查该client_id是否在channel里面.
 * @param client_id
 * @param channel_id
 * @returns {boolean}
 */
function check_client_id_in_channel(client_id, channel_id) {
    for (var i = 0; i < message_channel_pool[channel_id]['connection_pool'].length; i++) {
        if (message_channel_pool[channel_id]['connection_pool'][i] == client_id) {
            return true
        }
    }
    return false;
}

module.exports = self