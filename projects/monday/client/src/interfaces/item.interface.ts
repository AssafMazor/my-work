export interface IItem{
  id:string,
  boardId:string,
  data:{
    children:string[],
    name:string,
    statusId:number,
    members:string[],
    date:number,
    groupId:string,
    parentId:string,
  },
}    