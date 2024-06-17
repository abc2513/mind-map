import { useEffect, useReducer, useState } from 'react'
import style from './MindPage.module.css'
import { ActionType, initData, reducer } from './MindReducer';


import {
  focusNode, selectedNode,
  handleBlur, handleClick, handleFocus, handleMouseDown, handleMouseUp

} from './eventHandlers';


type nodeObjectType = {
  text: string,
  type: string,
  fold?: boolean | undefined,
  children?: nodeObjectType[]
}
type TreeNodeProps = {
  nodeObject: nodeObjectType,
  id: string,
}

function TreeNode(props: TreeNodeProps) {
  const { nodeObject, id } = props;
  const [pathData, setPathData] = useState<Array<any>>([]);
  const [nodeHeight, setNodeHeight] = useState<number>(0);


  useEffect(() => {//这个函数在每次渲染完成后执行,用于重绘path
    const childrenContianer = document.getElementById(`${id}-childrenContainer`);
    const nodeText = document.getElementById(`${id}-text`);

    if (!childrenContianer || !nodeText || !nodeObject.children) return;
    const newNodeHeight = childrenContianer.clientHeight;
    if (newNodeHeight !== nodeHeight) {
      const nodeY = nodeText.offsetTop + nodeText.clientHeight / 2;
      setNodeHeight(newNodeHeight);
      setPathData(nodeObject.children.map((child, index) => {
        const childNode = document.getElementById(`${id}-${index}-root`);
        if (!childNode) return null;
        const childY = childNode.offsetTop + childNode.clientHeight / 2;//孩子节点的中心点高度
        return (<path d={`M 0 ${nodeY} L 20 ${nodeY} L 20 ${childY} L 40 ${childY}`} fill="none" stroke="black" strokeWidth='2' />)
      }))
    }
  })
  return (
    <div className={style.mindmapNodeRoot} id={`${id}-root`}>
      <div className={style.mindmapNode} id={`${id}-text`}
        suppressContentEditableWarning
        draggable={nodeObject.type === 'node' ? true : false}
      >{nodeObject.text}</div>
      {
        nodeObject.children && nodeObject.children.length !== 0 && (
          <>
            <div className={style.pathConatiner}>
              <svg width='100%' height='100%'>
                {pathData}
              </svg>
            </div>
            <div className={style.mindmapChildrenConatiner} id={`${id}-childrenContainer`}>
              {nodeObject.children.map((child, index) => {
                return (
                  <TreeNode nodeObject={child} id={`${id}-${index}`} />
                )
              })}
            </div>
          </>
        )
      }

    </div>
  )

}
let _dispatch = (() => { }) as any;
const handleKeyUp = (e: KeyboardEvent) => {
  console.log(e.key);
  if (selectedNode) {
    if (!focusNode) {
      switch (e.key) {
        case 'Shift':
          _dispatch({ type: ActionType.createAfter, data: selectedNode })
          break;
        case 'Enter':
          _dispatch({ type: ActionType.createNext, data: selectedNode })
          break;
        case 'Backspace':
          //删除当前节点
          _dispatch({ type: ActionType.delete, data: selectedNode })
          break;
        default:
          break;
      }
    }
  }
}


export default function MindPage() {
  const [treeData, dispatch] = useReducer(reducer, initData);
  useEffect(() => {
    _dispatch = dispatch;
  }, [dispatch])

  useEffect(() => {
    try {
      document.body.removeEventListener('keyup', handleKeyUp);
    } catch (e) { }
    document.body.addEventListener('keyup', handleKeyUp)
  }, [])
  useEffect(() => {
    const root=document.getElementById('mindmapRoot');
    const container=document.getElementById('mindmapContainer');
    if(!root||!container)return;
    // root.scrollTo(root.scrollWidth/2,root.scrollHeight/2);
    root.scrollTo(
      container.scrollWidth/2-window.innerWidth*3/5,
      container.scrollHeight/2-window.innerHeight/2,
    );
  }, [])
  return (
    <div
      style={{width:'100vw',height:'100vh',overflow:'hidden'}}id='mindmapRoot'>
      <div
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          minWidth:'100%',
          // minHeight:'100%',
          padding:'50rem',
        }}
        id='mindmapContainer'
      >
        <TreeNode nodeObject={treeData} id='0' />
      </div>
    </div>
  )
}
