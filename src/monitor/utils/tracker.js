//上报数据

let host = 'cn-hangzhou.log.aliyuncs.com';
let project = 'web-monitor';
let logStore = 'log-store';
let userAgent = require('user-agent');

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name
  }
}

class SendTracker {
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logStore}/track`;//上报的路径
    this.xhr = new XMLHttpRequest;
  }
  send(data = {}) {
    //获取额外的参数
    let extraData = getExtraData()
    let log = {...data, ...extraData}
    // 阿里云规定上报的对象 值不能是数字类型
    for(let key in log) {
      if(typeof log[key] === 'number') {
        log[key] = `${log[key]}`
      }
    }
    let body = JSON.stringify({
      __logs__: [log]
    })
    this.xhr.open('POST', this.url, true);
    this.xhr.setRequestHeader('Content-Type', 'application/json');//请求体类型
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');//版本号
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);//请求体的大小
    this.xhr.onload = function () {
        // console.log(this.xhr.response);
    }
    this.xhr.onerror = function (error) {
        //console.log(error);
    }
    this.xhr.send(body);
  }
}




export default new SendTracker()