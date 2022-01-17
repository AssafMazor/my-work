export interface ITask {
    name: string,    
    title:string,
    parent:string,
    sentTime:number,
    labels:number[],
    isfinished:boolean,
    priority:number,
    category:number,
    id:string,
    children:number[]
}