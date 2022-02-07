export interface IResLabel {
    id:string,
    data:{
        name:string,
        favorite:boolean,
        isAttache:boolean
    }
}
export interface ILabel {
    name:string,
    favorite:boolean,
    isAttache:boolean
}

export interface ILabelItem {
    userId:string,
    labelId:string,
    data:ILabel
}