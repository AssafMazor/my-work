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
    //  getDate             
    //-------------------------

    getDate(sentTime:any):string{
      let start = moment(sentTime).startOf('day').valueOf();

      if(new Date(sentTime).getTime() === start){
        return sentTime.format('D MMM');
      }else {
        return sentTime.format('D MMM , hh:mm');
      }
    }
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}