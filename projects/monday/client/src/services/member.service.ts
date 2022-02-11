import $ from "jquery";;

export class MemberService {
    private static _instance: MemberService;

    constructor(){
    }
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}