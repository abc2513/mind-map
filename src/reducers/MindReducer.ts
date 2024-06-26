const initState = {
    text: '软件测试思维导图',
    type: 'file',
    fold: false,
    children: [
        {
            text: '软件测试基础',
            type: 'node',
            fold: false,
        },
        {
            text: '软件测试方法',
            type: 'node',
            fold: false,
            children: [
                {
                    text: '黑盒测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '白盒测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '灰盒测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '静态测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '动态测试',
                    type: 'node',
                    fold: false,
                },
            ]
        },
        {
            text: '软件测试技术',
            type: 'node',
            fold: false,
            children: [
                {
                    text: '自动化测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '性能测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '安全测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '压力测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '兼容性测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '接口测试',
                    type: 'node',
                    fold: false,
                },
                {
                    text: '安全测试',
                    type: 'node',
                    fold: false,
                },
            ]
        },
        {
            text: '软件测试工具',
            type: 'node',
            fold: false,
        },
        {
            text: '软件测试管理',
            type: 'node',
            fold: false,
        },
        {
            text: '软件测试工程',
            type: 'node',
            fold: false,
        },
        {
            text: '软件测试标准',
            type: 'node',
            fold: false,
        },
        {
            text: '软件测试认证',
            type: 'node',
            fold: false,
        },
        {
            text: '软件测试知识',
            type: 'node',
            fold: false,
        },
    ],

}
const newNodeTemplate = {
    text: '新节点',
    type: 'node',
    fold: false,
}
export const MIND_CREATE_NODE_AFTER = 'CREATE_AFTER';
export function createNodeAfter(selectedNode:string){
    return {
        type:MIND_CREATE_NODE_AFTER,
        data:selectedNode
    }
}
export const MIND_CREATE_NODE_NEXT = 'CREATE_NEXT';
export function createNodeNext(selectedNode:string){
    return {
        type:MIND_CREATE_NODE_NEXT,
        data:selectedNode
    }
}
export const MIND_MOVE_NODE_TO = 'MOVE_TO';
export const MIND_MOVE_TO_AFTER = 'MOVE_TO_AFTER';
export const MIND_DELETE_NODE = 'DELETE';
export function deleteNode(selectedNode:string){
    return {
        type:MIND_DELETE_NODE,
        data:selectedNode
    }
}


export function mindReducer(state: any = initState, action: { type: string; data: string; }|any) {
    try {
        const stateCopy=JSON.parse(JSON.stringify(state));
        let cur = stateCopy;
        switch (action.type) {
            case MIND_CREATE_NODE_AFTER:
                const indexList = action.data.split('-');
                for (let i = 1; i < indexList.length; i++) {
                    cur = cur.children[indexList[i]];
                }
                if (!cur.children) {
                    cur.children = [];
                }
                cur.children.push(newNodeTemplate);
                setTimeout(() => {
                    //产生一个点击事件，让新节点处于编辑状态
                    const newId = `${action.data}-${cur.children.length - 1}-text`;
                    const newElement = document.getElementById(newId);
                    if (newElement) {
                        newElement.click();
                        newElement.focus();
                    }
                }, 100);
                return stateCopy;
            case MIND_CREATE_NODE_NEXT:
                const indexList1 = action.data.split('-');
                for (let i = 1; i < indexList1.length - 1; i++) {
                    cur = cur.children[indexList1[i]];
                }
                cur.children.splice(parseInt(indexList1[indexList1.length - 1]) + 1, 0, newNodeTemplate);
                setTimeout(() => {
                    //产生一个点击事件，让新节点处于编辑状态
                    const lastLineIndex = action.data.lastIndexOf('-');
                    const newId = `${action.data.slice(0, lastLineIndex)}-${parseInt(indexList1[indexList1.length - 1]) + 1}-text`;
                    const newElement = document.getElementById(newId);
                    if (newElement) {
                        newElement.click();
                        newElement.focus();
                    }
                });
                return stateCopy;
            case MIND_MOVE_NODE_TO:
            case MIND_MOVE_TO_AFTER:
                return state;//todo
            case MIND_DELETE_NODE:
                const indexList2 = action.data.split('-');
                if (indexList2.length === 1) {
                    return state;
                }
                for (let i = 1; i < indexList2.length - 1; i++) {
                    cur = cur.children[indexList2[i]];
                }
                cur.children.splice(parseInt(indexList2[indexList2.length - 1]), 1);
                return stateCopy;
            default:
                return state;
        }
    } catch (e) {
        console.error(e);
        return state;
    }
}
