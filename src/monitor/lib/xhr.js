
import tracker from '../utils/tracker'

export function injectXHR() {
   let XMLHttpRequest = window.XMLHttpRequest
   let oldOpen = XMLHttpRequest.prototype.open
   XMLHttpRequest.prototype.open = function(method, url, async) {
     //匹配到这两种接口，不进行拦截监控
     if(!url.match(/logstores/) && !url.match(/sockjs/)) {
      this.logData = { method, url, async }
     }
      oldOpen.apply(this, arguments)
   }
 
   let oldSend = XMLHttpRequest.prototype.send
   
   XMLHttpRequest.prototype.send = function(body) {
      if(this.logData) {
         let startTime = Date.now();
         let handler = (type) => () => {
          let duration =  Date.now() - startTime
          let status = this.status;//200 500
          let statusText = this.statusText;// OK Server Error
          tracker.send({
            kind: 'stability',
            type: 'xhr',
            eventType: type,//load error abort
            pathname: this.logData.url,//请求路径
            status: status + '-' + statusText,//状态码
            duration,//持续时间
            response: this.response ? JSON.stringify(this.response) : '',//响应体
            params: body || ''
          })
         } 
         this.addEventListener('load', handler('load'), false)
         this.addEventListener('error', handler('error'), false)
         this.addEventListener('abort', handler('abort'), false)
      }
      oldSend.apply(this, arguments);
   }
}