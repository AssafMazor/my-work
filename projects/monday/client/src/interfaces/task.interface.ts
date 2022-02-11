export interface ITask{
    id:string,
    data:{
      children:string[],
      name:string,
      status:number,
      members:string[],
      date:number,
      groupId:string,
      parentId:string,
    },
}    