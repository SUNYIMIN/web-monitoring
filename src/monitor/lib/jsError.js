import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'

export function injectError() {
  //监听全局未捕获的错误
  window.addEventListener('error', (event) => {
      let lastEvent = getLastEvent()  //获取最后一个元素操作的事件对象
      let log = {
        kind: 'stability',//监控指标的大类
        type: 'error',//小类型 这是一个错误
        errorType: 'jsError',//JS执行错误
        message: event.message, //报错的信息
        filename: event.filename,//哪个文件报错了
        position: `${event.lineno}:${event.colno}`, //报错的文件位置
        stack: getLine(event.error.stack), //报错的栈信息
        selector: lastEvent ? getSelector(lastEvent.path) : ''//代表最后一个操作的元素
      }

      console.log(log)
      console.log(11111)
  }, true)
}



function getLine(stack) {
  return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join('^')
}