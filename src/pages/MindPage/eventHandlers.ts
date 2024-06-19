import style from './MindPage.module.css';
let selectedNode: string | undefined = undefined;
let focusNode: string | undefined = undefined;

const handleClick = (e:React.MouseEvent ) => {
  // console.log(e.target);
  if (!e.target) return;
  const target = e.target as HTMLElement;
  const id = target.id as string;
  if (!id) return;
  if (id.match(/-text$/)) {
    if (id === selectedNode + '-text') {
      //do nothing
    } else {
      console.log('select', id);
      selectedNode = id.replace('-text', '');
      //设置所有其他节点为不可编辑，当前节点可编辑
      const allText = document.querySelectorAll(`.${style.mindmapNode}`) as NodeListOf<HTMLElement>;

      for (let i = 0; i < allText.length; i++) {
        if (allText[i].id === id) {
          allText[i].contentEditable = 'true';
        } else {
          allText[i].contentEditable = 'false';
        }
      }
    }

  } else {
    selectedNode = undefined;

    //设置所有其他节点为不可编辑
    const allText = document.querySelectorAll(`.${style.mindmapNode}`) as NodeListOf<HTMLElement>;
    for (let i = 0; i < allText.length; i++) {
      allText[i].contentEditable = 'false';
    }
  }
};
const handleFocus = (e: React.FocusEvent) => {//获得焦点
  // console.log(e.target);
  const target = e.target as HTMLElement;
  const id = target.id as string;
  if (!id) return;
  if (id.match(/-text$/)) {
    console.log('focus', id);
    focusNode = id.replace('-text', '');
  }
};
const handleBlur = (e: React.FocusEvent) => {//失去焦点
  const target = e.target as HTMLElement;
  const id = target.id as string;
  if (!id) return;
  if (id.match(/-text$/)) {
    console.log('blur', id);
    focusNode = undefined;
  }
};
const handleDragStart = (e: DragEvent) => {//拖拽开始
  //todo
}
const handleDragOver = (e: DragEvent) => {//拖拽结束
  //todo
}
const handleMouseMoveWhenPress = function (e: MouseEvent) {//跟随移动进行页面滚动
  //跟随拖拽进行滚动
  const node = document.getElementById('mindmapRoot');
  console.log(node);
  if (!node) return;
  node.scrollTo(node.scrollLeft - e.movementX, node.scrollTop - e.movementY);
}
const handleMouseDown = function (e: React.MouseEvent) {//鼠标按下
  const target = e.target as HTMLElement;
  if (!target.id) return;
  if (target.id.match(/-text$/)) return;
  const node = document.getElementById('mindmapRoot');
  if (!node) return;
  node.addEventListener('mousemove', handleMouseMoveWhenPress);
}
const handleMouseUp = function (e:React.MouseEvent) {//鼠标释放
  const node = document.getElementById('mindmapRoot');
  if (!node) return;
  node.removeEventListener('mousemove', handleMouseMoveWhenPress);
}
const handleWhell = function (e: WheelEvent) {//鼠标滚轮滚动
  // e.deltaX
  if(e.ctrlKey){
    const node = document.getElementById('mindmapContainer');
    if (!node) return;
    node.style.scale+=e.deltaY;

  }
  
}

export {
  focusNode, selectedNode,
  handleClick, handleFocus, handleBlur, handleDragStart, handleDragOver, handleMouseDown, handleMouseUp, handleWhell
}