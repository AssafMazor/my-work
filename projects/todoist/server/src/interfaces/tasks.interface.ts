export interface ITask {
    id:string,
    data:{
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
}