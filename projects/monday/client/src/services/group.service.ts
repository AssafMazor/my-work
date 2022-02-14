import $ from "jquery";
import {EventEmitter} from 'events';
import { IGroup } from "../interfaces/group.interface";

export class GroupService {
    private static _instance: GroupService;
    public eventEmitter:EventEmitter = new EventEmitter();

    private groupList:IGroup[] = [];

    constructor(){
    }

    laodData(callback){
        $.ajax({
            type: "GET",
            url: `http://localhost:3000/88/1/groups`,
            success: (result) => {
                this.groupList = result;
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    getGroupList(){
        return this.groupList
    }

    addGroup(callback){
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/1/addGroup/${new Date().getTime().toString()}`,
            data: {
                "name":"New Group",
            },
            success: (result) => {
                this.groupList = result
                this.eventEmitter.emit("group-change");
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}