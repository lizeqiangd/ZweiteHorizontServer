var phpapi = require('../net/PHPAPI/PHPAPI.js');
/**
 * This is a class of ZweiteHorizont Server.
 * SystemManager
 */
    
var self = {
    //主要运行程序
    main: function () {
        Date.prototype.format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        self.server_start_time = new Date().getTime() / 1000;
    },

    //系统开始时间,ms
    server_start_time: 0,

    //系统已经运行了的时间,ms
    server_already_running_time: function () {
        return new Date().getTime() / 1000 - self.server_start_time;
    },

    //获取系统当前时间,'yyyy-MM-dd hh:mm:ss'
    get_server_time: function () {
        return new Date().format('yyyy-MM-dd hh:mm:ss');
    },

    //返回用户数据
    get_return_object: function (c2sobj) {
        return {
            fingerprint: c2sobj.fingerprint,
            client_id: c2sobj.client_id,
            timestamp: self.get_server_time(),
            module: c2sobj.module,
            action: c2sobj.action,
            data: {}
        }
    },
    get_unique_id: function () {
        var code = this.get_server_time() + Math.random();
        var sha = require('crypto').createHash('sha1').update(code, 'utf8');
        return sha.digest('hex');
    },
    check_access_key_vaild: function (key) {
        return true;
    },
    end: 0
}

module.exports = self