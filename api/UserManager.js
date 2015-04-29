var http= require('http');
var querystring=require('querystring');
var events= require('events');
var emitter=new events.EventEmitter();
/**
 * This is a simple php api caller base on event dispatch model.
 * var phpapi=require('PhpApi');
 * phpapi.on('data',function (e){console.log(e);})
 * phpapi.on('object',function(e){console.log(e);})
 * phpapi.on('error',function(e){console.log(e);})
 * phpapi.setApiPath('/zweitehorizont/api/system/system_info.php');
 * phpapi.setHost('google.com');
 * phpapi.callApi({msg:'test object'});
 * 
 * @author:Lizeqiangd 
 * @create:2015.03.04
 */
var req 
var postData = {};
var options = {
  hostname: 'bilibili.moe',
  port: 80,
  path: '/',
  method: 'POST'
};

function callPHP(){
  options.headers={
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': querystring.stringify(postData).length
  }
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) { 
        //console.log('PHPAPI:get data :',chunk);
        emitter.emit('data',chunk);
        try{
          var obj=JSON.parse(chunk);
          emitter.emit('object',obj);        
        }catch(e){
          //console.log('PHPAPI:failed emit object event :',e);
        }
    });
  });
  req.on('error',function(e){emitter.emit('error',e)});
  req.write(querystring.stringify(postData));
  req.end();
}

exports.setHost=setHostname;
exports.setHostname=setHostname;
function setHostname(hostname){
  options.hostname=hostname;
}

exports.setApiPath = setAPIPath;
exports.setPath = setAPIPath;
function setAPIPath (path) {
  options.path=path;
}

exports.reset=removeAllListeners;
exports.removeAllListeners=removeAllListeners;
function removeAllListeners(){
  emitter.removeAllListeners();
}

exports.callApi=callPHPAPI;
exports.call=callPHPAPI;
exports.callAction=function(action){
  callPHPAPI({'action':action});
}
function callPHPAPI(obj){
  postData=obj;
  callPHP();
}

exports.on=function (event_name,event_handler){
  emitter.on(event_name,event_handler);
}

// exports.syncCallApi=function (obj){
//   var returnObj={};
//   var load_complete=false;
//   var time_out=false;
//   postData=obj;
//   emitter.on('data',function (data){returnObj=data;load_complete=true;});
//   emitter.on('error',function (data){returnObj=data;load_complete=true;});
//   callPHP();
//   setInterval();(function(){
//     time_out=true;
//     console.log('time out');
//   }, 50);
//   do{
//     if(load_complete){
//       console.log('data get');
//       emitter.removeAllListeners();
//       return returnObj;
//     }
//   }while(!time_out)
// }