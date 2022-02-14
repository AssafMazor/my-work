import $ from "jquery";
import {EventEmitter} from 'events';
import { IItem } from "../interfaces/item.interface";

export enum eStatusColor {
    'Working on it' = 1,
    'Stuck' = 2,
    'Done' = 3,
    '' = 4
 };

export class ItemService {
    private static _instance: ItemService;
    private itemList:IItem[] = [];
    public eventEmitter:EventEmitter = new EventEmitter();

    constructor(){
    }

    //--------------------------------
    // laodData
    //---------------------------------
    
    laodData(callback:Function){
        $.ajax({
            type: "GET",
            url: `http://localhost:3000/88/1/items`,
            success: (result) => {
                this.itemList = result;
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //--------------------------------
    // laodData
    //---------------------------------

    getTask(taskId:string):IItem{
        let filtered = this.itemList.filter((item)=>{
            return item.id === taskId
        })[0]
        return filtered
    }

    //--------------------------------
    // getTasks
    //---------------------------------

    getItems(){
        let filtered = this.itemList.filter((item)=>{
            return item.data.parentId === "-1"
        })
        return filtered;
    }

    //--------------------------------
    // getItemsByGroupId
    //---------------------------------

    getItemsByGroupId(groupId:string){
        let filter = this.itemList.filter((item)=>{
            return item.data.groupId === groupId
        })
        return filter
    }

    //--------------------------------
    // getStatusNameById
    //---------------------------------

    getStatusNameById(statusId:number){
        return Object.keys(eStatusColor)[Object.values(eStatusColor).indexOf(statusId)];
    }

    //--------------------------------
    // addItem
    //---------------------------------

    addItem(itemName:string,groupId:string,callback:Function){
        let newItem:IItem = {
            id:new Date().getTime().toString(),
            data:{
                children:[],
                name:itemName,
                statusId:4,
                members:[],
                date:new Date().getTime(),
                groupId:groupId,
                parentId:"-1",
            }
        }
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/1/addItem/${new Date().getTime().toString()}`,
            data: {
                "data":JSON.stringify(newItem),
            },
            success: (result) => {
                this.itemList = result
                this.eventEmitter.emit("items-change");
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //--------------------------------
    // addSubTask
    //---------------------------------

    addSubItem(parent:IItem,callback:Function){
        debugger;
        let newSubItem:IItem = {
            id:new Date().getTime().toString(),
            data:{
                children:[],
                name:"Sub item",
                statusId:4,
                members:[],
                date:new Date().getTime(),
                groupId:parent.data.groupId,
                parentId:parent.id,
            }
        }
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/1/addSubItem/${newSubItem.id}`,
            data: {
                "data":JSON.stringify(newSubItem),
            },
            success: (result) => {
                this.itemList = result
                this.eventEmitter.emit("items-change");
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