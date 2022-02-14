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
      return sentTime.format('D MMM');
    }
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}