import $ from "jquery";;

export class boardService {
    private static _instance: boardService;

    constructor(){
    }
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}