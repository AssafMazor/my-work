export interface ITask {
    name: string,    
    content:string,
    title:string,
    sentTime:number,
    labels:number[],
    isfinished:boolean,
    priority:number[],
    category:number,
    id:number
}