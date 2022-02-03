import  $ from "jquery";
import moment from "moment";

export interface IPosition{
    btnClass:string,
    dialogClass: string
}

export class CommonService {
    private static _instance: CommonService;

    constructor(){
    }

    //-------------------------
    //  getPotions             
    //-------------------------

    getPotions($parentEl:any, pos:IPosition){
        let offset = $parentEl.find(pos.btnClass).offset()
        let BtnHeigth = $parentEl.find(pos.btnClass).height()
        let pageHeigth = window.innerHeight
        let ListHeigth = $parentEl.find(pos.dialogClass).height()
        let list =  $parentEl.find(pos.dialogClass)
        let top:number;
        let left:number;
        let bottom:number;
 
        if(pageHeigth - (offset.top + ListHeigth) > 0){
          top =  offset.top + BtnHeigth;
          left = offset.left - 100;
            list.css('top' , top)
        }else {
          bottom = pageHeigth - offset.top;
          left = offset.left - 100;
          list.css('bottom' , bottom)
        }
        list.css('left' , left)
    }

    //-------------------------
    //  getDate             
    //-------------------------

    getDate(sentTime:any):string{
      let now = moment();
      let diff = now.diff(sentTime, 'days') + 1;
      if(diff > 7){
          if(new Date(sentTime).getHours() > 0){
              return sentTime.format('D MMM h:m');
          }else {
              return sentTime.format('D MMM');
          }
      }else {
          if(diff > 0){
              if(new Date(sentTime).getHours() > 0){
                  return moment(sentTime).format('ddd h:m');
              }else {
                return moment(sentTime).format('dddd');
              }
          }else {
              if(!isNaN(diff)){
                  return `today  ${sentTime.format('h:m')}`
              }else {
                  return "Schedule"
              }
          }
      }
    }
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}