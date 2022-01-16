export interface ITask {
    name: string,    
    title:string,
    sentTime:number,
    labels:number[],
    isfinished:boolean,
    priority:number,
    category:number,
    id:number,
    children:number[]
}