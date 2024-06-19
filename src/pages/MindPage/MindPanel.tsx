import React, { useEffect } from 'react'
import style from './MindPanel.module.css'
import { MenuOutlined,
  WifiOutlined,
 } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { CloseCircleOutlined } from '@ant-design/icons'

type Operation = {
  key: string,
  label: string,
  handler: Function,
  icon: any,
}
function getOperation(key:string, label:string, handler:Function, icon:any):Operation{
  return {key, label, handler, icon};
}
function getOperations(dispatch:Function):Array<Operation>{
  return [
    //格式刷，子主题，相邻主题，删除，图片
    getOperation("formatBrush", "格式刷", ()=>{}, CloseCircleOutlined),
    getOperation("subTopic", "子主题", ()=>{}, CloseCircleOutlined),
    getOperation("adjacentTopic", "相邻主题", ()=>{}, CloseCircleOutlined),
    getOperation("delete", "删除", ()=>{}, CloseCircleOutlined),
    getOperation("image", "图片", ()=>{}, CloseCircleOutlined),
  ]}

function OperationPanel() {
  const dispatch = useDispatch();
  const [operations,setOperations] = React.useState<Array<Operation>>([]);
  useEffect(() => {
  },[]);
  
  return (<div className={style.OperationPanel}></div>);
}
export default function MindPanel() {
  return (
    <>
      <div className={style.TopPanel}>
        <div className={style.FilePanel}>
          <div className={style.FilePanel_fileMenuIcon}><MenuOutlined/></div>
          <div className={style.FilePanel_fileName}>示例思维导图aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
        </div>
        <OperationPanel/>
        <div className={style.NetworkPanel}>
          <div className={style.NetworkPanel_network}>
          <WifiOutlined />
          </div>
          <div className={style.NetworkPanel_operator}></div>
        </div>
        <div></div>
      </div>
      <div className={style.BottomPanel}></div>
    </>
  )
}
