var phpapi = require('../net/PHPAPI/PHPAPI.js');
var utils = require('./utils.js');
/**
 * This is a class of ZweiteHorizont Server.
 * @contructor
 * ConnectionManager
 */


function class_connection() {
    this.client_id = 0;
    this.socket = 0;
    this.connected_time = '0';
}
/**
 * @type {Array.<class_connection>}
 */
var connection_pool = [];

var system_api={};
//ConnectionService.RemoveConnectionFromService(oSocket);
//console.log('A client disconnected. now connections:'+  api.connection_manager.get_connection_count());
var self = {
    config_system:function (obj){
        system_api=obj
    },
    /**
     * @returns {Array.<class_connection>}
     */
    get_connection_pool:function(){
      return connection_pool;
    },
    access_zweitehorizont_server: function (obj) {
        if (utils.check_access_key_vaild(obj.access_key)) {
            var c = new class_connection();
            c.client_id = utils.get_unique_id();
            c.connected_time = utils.get_server_time()
            c.socket = obj.connection;
            connection_pool.push(c)
            obj.connection.send_object({client_id: c.client_id});
            console.log('ConnectionManager:new user access success,',connection_pool.length,' client_id:', c.client_id);
        } else {
            obj.connection.send_object({msg: 'access deny'});
        }
    },
    remove_connection_from_server: function (socket) {
        var remove_index=this.find_connection(socket,'socket','index');
        connection_pool.splice(remove_index,1);
        console.log('ConnectionManager:user leave ',connection_pool.length);
    },
    find_connection: function (obj, input, output) {
        var find_obj;
        input_switch:switch (input) {
            case 'index':
                if (obj >= 0 || obj <= connection_pool.length) {
                    find_obj = connection_pool[obj];
                    break input_switch;
                }
            case 'client_id':
                for (var i = 0; i < connection_pool.length; i++) {
                    if (connection_pool[i].client_id == obj) {
                        find_obj = connection_pool[i];
                        break input_switch;
                    }
                }
            case 'socket':
                for (var i = 0; i < connection_pool.length; i++) {
                    if (connection_pool[i].socket == obj) {
                        find_obj = connection_pool[i];
                        break input_switch;
                    }
                }
            default :
                if (obj >= 0 || obj <= connection_pool.length) {
                    find_obj = connection_pool[obj];
                    break input_switch;
                }
        }

        output_switch:switch (output) {
            case 'index':
                return i;
            case 'client_id':
                find_obj.client_id;
            case 'socket':
                return find_obj.socket;
            default :
                return i;
        }

    },
    get_connection_count: function () {
        return connection_pool.length;
    },
    end: 0
}
module.exports = self