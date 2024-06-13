import { useEffect, useReducer, useState } from 'react'
import style from './MindPage.module.css'
import { ActionType, initData, reducer } from './MindReducer';


let selectedNode: string | undefined = undefined;
let focusNode: string | undefined = undefined;


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
      console.log('useEffect', id);
      const newNodeHeight = childrenContianer.clientHeight;
      if (newNodeHeight !== nodeHeight) {
        console.log('nodeHeight change', id);
        const nodeY = nodeText.offsetTop + nodeText.clientHeight / 2;
        setNodeHeight(newNodeHeight);
        setPathData(nodeObject.children.map((child, index) => {
          const childNode = document.getElementById(`${id}-${index}`);
          if (!childNode) return null;
          const childY = childNode.offsetTop + childNode.clientHeight / 2;//孩子节点的中心点高度
          return (<path d={`M 0 ${nodeY} L 20 ${nodeY} L 20 ${childY} L 40 ${childY}`} fill="none" stroke="black" strokeWidth='2' />)
        }))
      }
  })
  return (
    <div className={style.mindmapNodeRoot} id={id}>
      <div className={style.mindmapNode} id={`${id}-text`}
        suppressContentEditableWarning
        draggable="true"
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
const handleClick = (e: any) => {
  // console.log(e.target);
  const id = e.target?.id as string;
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
const handleFocus = (e: any) => {
  // console.log(e.target);
  const id = e.target?.id as string;
  if (!id) return;
  if (id.match(/-text$/)) {
    console.log('focus', id);
    focusNode = id.replace('-text', '');
  }
};
const handleBlur = (e: any) => {
  // console.log(e.target);
  const id = e.target?.id as string;
  if (!id) return;
  if (id.match(/-text$/)) {
    console.log('blur', id);
    focusNode = undefined;
  }
};
const handleDragStart = (e: any) => { }
const handleDragOver = (e: any) => { }

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
  return (
    <div
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <TreeNode nodeObject={treeData} id='0' />
    </div>
  )
}
