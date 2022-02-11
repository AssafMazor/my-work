import $ from "jquery";;

export class GroupService {
    private static _instance: GroupService;

    constructor(){
    }
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}