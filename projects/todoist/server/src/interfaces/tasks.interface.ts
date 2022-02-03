
export interface ITask{
    name: string,    
    title:string,
    parentId:string,
    isToday:boolean,
    sentTime:number,
    labels:string[],
    isfinished:boolean,
    priority:number,
    category:number,
    children:string[],
    sectionId:string
}

export interface IResTask {
    id:string
    name: string,    
    title:string,
    parentId:string,
    isToday:boolean,
    sentTime:number,
    labels:string[],
    isfinished:boolean,
    priority:number,
    category:number,
    children:string[],
    sectionId:string
}

export interface ITaskItem {
    userId: string,
    taskId: string,
    data: ITask
}