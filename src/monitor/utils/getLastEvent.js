
let lastEvent;
function getLastEvent() {
  ['click', 'touchstart', 'mousedown', 'mouseover', 'keydown', 'keyup'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
          lastEvent = event;
      }, {
          capture: true,//捕获阶段处理事件函数
          passive: true//默认不阻止默认事件
      });
  });
}
getLastEvent()

export default function () {
    return lastEvent;
}