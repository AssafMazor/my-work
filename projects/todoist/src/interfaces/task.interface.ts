export interface ITask {
    name: string,    
    title:string,
    parentId:string,
    isToday:boolean,
    sentTime:number,
    labels:string[],
    isfinished:boolean,
    priority:number,
    category:number,
    id:string,
    children:string[],
    sectionId:string
}