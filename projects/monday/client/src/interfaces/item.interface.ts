export interface IItem{
    id:string,
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