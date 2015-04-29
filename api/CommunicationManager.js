var phpapi = require('../net/PHPAPI/PHPAPI.js');
var utils = require('./utils.js');

/**
 * This is a class of ZweiteHorizont Server.
 * CommunicationManager
 */

var system_api = {};
var self = {
    config_system: function (obj) {
        system_api = obj
    },
    test_boardcast_message: function (obj) {
        var pool = system_api.connection_manager.get_connection_pool()
        var robj = system_api.utils.get_return_object(obj);
        robj.data = obj.data
        for (var i = 0; i < pool.length; i++) {
            pool[i].send_object(robj);
        }
        console.log('CommunicationManager:', obj.client_id, 'has boardcast a message');
    },
    end: 0
}
module.exports = self