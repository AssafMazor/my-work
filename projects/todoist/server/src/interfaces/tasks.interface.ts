
export interface ITask{
    name: string,    
    title:string,
    parentId:string,
    sentTime:number,
    isToday:boolean,
    labels:string[],
    isfinished:boolean,
    priority:number,
    category:number,
    children:string[],
    sectionId:string
}

export interface IResTask {
    id:string,
    data:ITask
}

export interface ITaskItem {
    userId: string,
    taskId: string,
    data: ITask
}