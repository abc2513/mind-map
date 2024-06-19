import { useEffect,useState } from 'react'
import style from './MindPage.module.css'


import {
  focusNode, selectedNode,
  handleBlur, handleClick, handleFocus, handleMouseDown, handleMouseUp,
  handleWhell

} from './eventHandlers';
import { createNodeAfter, createNodeNext, deleteNode } from '../../reducers/MindReducer';
import { useDispatch, useSelector } from 'react-redux';
import MindPanel from './MindPanel';


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
const getHandleKeyUp = (dispatch: any) => (e: KeyboardEvent) => {
  console.log(e.key);
  if (selectedNode) {
    if (!focusNode) {
      switch (e.key) {
        case 'Shift':
          dispatch(createNodeAfter(selectedNode));
          break;
        case 'Enter':
          dispatch(createNodeNext(selectedNode));
          break;
        case 'Backspace':
          //删除当前节点
          dispatch(deleteNode(selectedNode));
          break;
        default:
          break;
      }
    }
  }
}


export default function MindPage() {
  const dispatch = useDispatch();
  const mind = useSelector((state: any) => state.mind);
  useEffect(() => {
    const handleKeyUp = getHandleKeyUp(dispatch);
    document.body.addEventListener('keyup', handleKeyUp)
    document.body.addEventListener('wheel', handleWhell)
    return () => {
      document.body.removeEventListener('keyup', handleKeyUp)
      document.body.removeEventListener('wheel', handleWhell)
    }
  }, [])
  useEffect(() => {
    const root = document.getElementById('mindmapRoot');
    const container = document.getElementById('mindmapContainer');
    if (!root || !container) return;
    // root.scrollTo(root.scrollWidth/2,root.scrollHeight/2);
    root.scrollTo(
      container.scrollWidth / 2 - window.innerWidth * 3 / 5,
      container.scrollHeight / 2 - window.innerHeight / 2,
    );
  }, [])
  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'hidden',position:'relative' }} id='mindmapRoot'>
      <div
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          minWidth: '100%',
          // minHeight:'100%',
          padding: '50rem',
        }}
        id='mindmapContainer'
      >
        <TreeNode nodeObject={mind} id='0' />
      </div>
      <MindPanel/>
    </div>
  )
}
