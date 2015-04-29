/**
 * This is a class of ZweiteHorizont Server.
 * ConnectionManager
 */

var connection_pool = [];
var system_api = {};
var self = {
    config_system: function (obj) {
        system_api = obj
    },
    /**
     * 获取连接池
     */
    get_connection_pool: function () {
             return connection_pool;
    },
    /**
     * 验证身份.
     * @param obj
     */
    access_zweitehorizont_server: function (obj) {
        if (system_api.utils.check_access_key_vaild(obj.access_key)) {
            obj.connection.client_id=system_api.utils.get_unique_id();
            obj.connection.connected_time=system_api.utils.get_server_time()
            connection_pool.push(obj.connection)
            obj.connection.send_object({client_id:obj.connection.client_id});
            console.log('ConnectionManager:new user access success,',  'client_id:', obj.connection.client_id);
        } else {
            obj.connection.send_object({msg: 'access deny'});
        }
    },
    /**
     * 移除连接
     * @param socket
     */
    remove_connection_from_server: function (socket) {
        var remove_index = this.find_connection(socket, 'socket', 'index');
        connection_pool.splice(remove_index,1);
        console.log('ConnectionManager:user leave ,now online:', connection_pool.length);
    },
    /**
     * 寻找连接
     * @param obj
     * @param input
     * @param output
     * @returns {*}
     */
    find_connection: function (obj, input, output) {
        var find_obj;
        var i = 0
        input_switch:switch (input) {
            case 'index':
                if (obj >= 0 || obj <= connection_pool.length) {
                    find_obj = connection_pool[obj];
                    break;
                }
                break;
            case 'client_id':
                for (i; i < connection_pool.length; i++) {
                    if (connection_pool[i].client_id == obj) {
                        find_obj = connection_pool[i];
                        break;
                    }
                }
                break;
            case 'socket':
                for (i; i < connection_pool.length; i++) {
                    if (connection_pool[i].client_id == obj.client_id) {
                        find_obj = connection_pool[i];
                        break;
                    }
                }
                break;
            default :
                if (obj >= 0 || obj <= connection_pool.length) {
                    find_obj = connection_pool[obj];
                    break;
                }
        }
        output_switch:switch (output) {
            case 'index':
                return i;
            case 'client_id':
                return find_obj.client_id;
            case 'socket':
                return find_obj;
            default :
                return i;
        }
    },
    /**
     * 获取连接总数
     * @returns {Number}
     */
    get_connection_count: function () {
        return connection_pool.length;
    },
    end: 0
}
module.exports = self