import $ from "jquery";
import { IMember } from "../interfaces/member.interface";
import { EventEmitter } from 'events';

export class MemberService {
    private static _instance: MemberService;
    private memberList:IMember[] = [];
    public eventEmitter:EventEmitter = new EventEmitter();

    constructor(){
    }

    //-------------------------------
    // loadData
    //---------------------------------

    loadData(callback:Function){
        $.ajax({
            type: "GET",
            url: `http://localhost:3000/88/1/members`,
            success: (result) => {
                this.memberList = result;
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //-------------------------------
    // getMembersById
    //---------------------------------

    getMembersById(memberId:string):IMember[]{
        let filterd = this.memberList.filter((member)=>{
            return member.id === memberId
        })
        return filterd
    }

    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}