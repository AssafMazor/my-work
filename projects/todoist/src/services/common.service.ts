import  $ from "jquery";
import moment from "moment";

export class commonService {
    private static _instance: commonService;

    constructor(){
    }

    //-------------------------
    //  getPotions             
    //-------------------------

    getPotions($parentEl){
        let offset = $parentEl.find(".set-potions-btn").offset()
        let BtnHeigth = $parentEl.find(".set-potions-btn").height()
        let pageHeigth = window.innerHeight
        let ListHeigth = $parentEl.find(".set-potions-dialog").height()
        let list =  $parentEl.find(".set-potions-dialog")
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

    getDate(sentTime){
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