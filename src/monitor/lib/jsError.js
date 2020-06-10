import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'
import tracker from '../utils/tracker'

export function injectError() {
  //监听全局未捕获的错误
  window.addEventListener('error', (event) => {
      console.log('event', event)
      let lastEvent = getLastEvent()  //获取最后一个元素操作的事件对象  
      //监控脚本加载错误
      if(event.target && (event.target.src || event.target.href)) {
        tracker.send({
          kind: 'stability',//监控指标的大类
          type: 'error',//小类型 这是一个错误
          errorType: 'resourceError',//js或css资源加载错误
          filename: event.target.src || event.target.href,//哪个文件报错了
          tagName: event.target.tagName,//SCRIPT
          //body div#container div.content input
          selector: getSelector(event.target) //代表最后一个操作的元素
       });
      } else {
        tracker.send({
          kind: 'stability',//监控指标的大类
          type: 'error',//小类型 这是一个错误
          errorType: 'jsError',//JS执行错误
          message: event.message, //报错的信息
          filename: event.filename,//哪个文件报错了
          position: `${event.lineno}:${event.colno}`, //报错的文件位置
          stack: getLine(event.error.stack), //报错的栈信息
          selector: lastEvent ? getSelector(lastEvent.path) : ''//代表最后一个操作的元素
        });
      }

  }, true)

  window.addEventListener('unhandledrejection', function(event) {
      console.log('promise', event)
      let lastEvent = getLastEvent()  //获取最后一个元素操作的事件对象

      let reason = event.reason
      let message
      let filename
      let line
      let column
      let stack
      if(typeof reason === 'string') {
        message = reason
      } else if(typeof reason === 'object') {
        message = reason.message
        if (reason.stack) {
          let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
              console.log('ssss', matchResult)
              filename = matchResult[1];
              line = matchResult[2];
              column = matchResult[3];
          }

          stack = getLine(reason.stack);
      }
      tracker.send({
        kind: 'stability',//监控指标的大类
        type: 'error',//小类型 这是一个错误
        errorType: 'promiseError',//JS执行错误
        message, 
        filename,//哪个文件报错了
        position: `${line}:${column}`,
        stack,
        selector: lastEvent ? getSelector(lastEvent.path) : ''//代表最后一个操作的元素
      })
  }, true)
}



function getLine(stack) {
  return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join('^')
}