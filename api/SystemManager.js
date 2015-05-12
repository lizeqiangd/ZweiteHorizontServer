var phpapi = require('../net/PHPAPI/PHPAPI.js');
var utils = require('./utils.js');
/**
 * This is a class of ZweiteHorizont Server.
 * SystemManager
 */

var system_api = {};
var self = {
    config_system: function (obj) {
        system_api = obj
    },
    /**
     * ��ȡnode��������ʱ��
     * @param obj
     */
    get_node_server_time: function (obj) {
        var robj = getReturnObject(obj);
        robj.data.node_time = system_api.get_server_time();
        obj.connection.sendObject(robj);
    },
    /**
     * ��ȡphp��������ʱ��
     * @param obj
     */
    get_php_server_time: function (obj) {
        phpapi.setApiPath('/zweitehorizont/api/system/system_info.php');
        phpapi.on('object', function (rtobj) {
            var robj = getReturnObject(obj);
            robj.data.php_time = rtobj.time;
            obj.connection.sendObject(robj);
            phpapi.removeAllListeners();
        })
        phpapi.callAction('get_server_time');
    },
    /**
     * ��ȡ������ȫ����Ϣ.
     * @param obj
     */
    get_system_infotmation: function (obj) {
        var robj = utils.getReturnObject(obj);
        robj.data.server_name = 'ZweiteHorizont_Node_Server 01';
        robj.data.administrator = 'Lizeqiangd';
        robj.data.server_already_running_time = utils.server_already_running_time();

        obj.connection.sendObject(robj);
    },
    end:0
}
module.exports = self