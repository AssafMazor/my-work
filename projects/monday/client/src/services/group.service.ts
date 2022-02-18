import $ from "jquery";
import {EventEmitter} from 'events';
import { IGroup } from "../interfaces/group.interface";

export class GroupService {
    private static _instance: GroupService;
    public eventEmitter:EventEmitter = new EventEmitter();

    private groupList:IGroup[] = [];

    constructor(){
    }

    //--------------------------------
    // laodData
    //---------------------------------

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

    //--------------------------------
    // getGroupList
    //---------------------------------

    getGroupList(){
        return this.groupList
    }

    //--------------------------------
    // addGroup
    //---------------------------------

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

    //--------------------------------
    // changeGroupName
    //---------------------------------

    changeGroupName(group:IGroup,groupName:string,callback:Function){
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/88/1/chengeName/${group.id}`,
            data: {
                "data":{
                    groupId:group.id,
                    groupName:groupName
                },
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

    //--------------------------------
    // deleteGroup
    //---------------------------------

    deleteGroup(group:IGroup,callback:Function){
        $.ajax({
            type: "DELETE",
            url: `http://localhost:3000/88/1/deleteGroup/${group.id}`,
            data: {
                "data":group.id
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

    //--------------------------------
    // duplicateGroup
    //---------------------------------

    duplicateGroup(group:IGroup,callback:Function){
        let serverGroup = {
            boardId:"1",
            groupId:group.id,
            groupName:group.name
        }
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/1/duplicateGroup/${group.id}`,
            data: {
                "data":serverGroup
            },
            success: (result) => {
                console.log(result)
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