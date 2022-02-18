import $ from "jquery";;

export class BoardService {
    private static _instance: BoardService;

    constructor(){
    }

    laodData(callback){
        callback()
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}