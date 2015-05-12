/**
 * This is a class of ZweiteHorizont Server.
 * ConnectionManager
 * 传入进来的数据
 * data{
 *  connection:Socket
 *  //这里会connection加入client_id和connected_time 2个属性.
 * }
 * 保存到连接池的数据为一个标准的ObjectSocket的原型增加2个属性
 * oSocket{
 *  client_id
 *  connected_time
 *  ....其他connection方法和属性,用于随时调用. *
 * }
 */
var connection_hash_pool = {};
var connection_pool = [];
var system_api = {};
var self = {
    config_system: function (obj) {
        system_api = obj
    },
    /**
     * get connection pool array.
     */
    get_connection_pool: function () {
        return connection_pool;
    },
    /**
     * to access the system . server need an vaild token. which is not ready yet.
     * @param obj
     */
    access_zweitehorizont_server: function (obj) {
        if (system_api.utils.check_access_key_vaild(obj.access_key)) {
            obj.connection.client_id = system_api.utils.get_unique_id();
            obj.connection.connected_time = system_api.utils.get_server_time();
            connection_hash_pool[obj.connection.client_id]=obj.connection;
            connection_pool.push(obj.connection)
            obj.connection.send_object({client_id: obj.connection.client_id});
            console.log('ConnectionManager:new user access success,', 'client_id:', obj.connection.client_id);
        } else {
            obj.connection.send_object({msg: 'access deny'});
        }
    },
    /**
     * remove an connection from server.
     * @param socket
     */
    remove_connection_from_server: function (socket) {
        var remove_index = this.find_connection(socket, 'socket', 'index');
        var remove_client_id=connection_pool[remove_index].client_id

        connection_pool.splice(remove_index, 1);
        delete connection_hash_pool[remove_client_id];
        console.log('ConnectionManager:user leave ,now online:', connection_pool.length);
    },
    /**
     * find an connection instance  by input and output
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
                find_obj=connection_hash_pool[input];
                //for (i; i < connection_pool.length; i++) {
                //    if (connection_pool[i].client_id == obj) {
                //        find_obj = connection_pool[i];
                //        break;
                //    }
                //}
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
        if(!find_obj){
            return false;
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
     * return the length of connection pool array.
     * @returns {Number}
     */
    get_connection_count: function () {
        return connection_pool.length;
    },
    end: 0
}
module.exports = self