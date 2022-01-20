import  $ from "jquery";

export class commonService {
    private static _instance: commonService;

    constructor(){
    }

    getPotions( $parentEl){
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
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}