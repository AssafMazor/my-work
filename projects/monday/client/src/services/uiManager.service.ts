import $ from "jquery";;

export class UiManagerService {
    private static _instance: UiManagerService;

    constructor(){
    }
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}