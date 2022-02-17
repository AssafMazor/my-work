import $ from "jquery";
import {EventEmitter} from 'events';
import { IItem } from "../interfaces/item.interface";

export enum eStatusColor {
    'Working on it' = 1,
    'Stuck' = 2,
    'Done' = 3,
    '' = 4
};

export enum eStatusClassName {
    'working' = 1,
    'stuck' = 2,
    'done' = 3,
    'none' = 4
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

    getItems():IItem[]{
        let filtered = this.itemList.filter((item)=>{
            return item.data.parentId === "-1"
        })
        return filtered;
    }

    //--------------------------------
    // getItemsByGroupId
    //---------------------------------

    getItemsByGroupId(groupId:string):IItem[]{
        let filtered = this.itemList.filter((item)=>{
            return item.data.groupId === groupId && item.data.parentId === "-1"
        })
        return filtered
    }

    //--------------------------------
    // getStatusNameById
    //---------------------------------

    getStatusNameById(statusId:number):string{
        return Object.keys(eStatusColor)[Object.values(eStatusColor).indexOf(statusId)];
    }

    //--------------------------------
    // getItemsArrByStatusId
    //---------------------------------

    getItemsArrByStatusId(groupId:string,itemsList:IItem[]){
        return {
            working:this.getItemsByStatusId(1,groupId) / itemsList.length,
            stack:this.getItemsByStatusId(2,groupId) / itemsList.length,
            done:this.getItemsByStatusId(3,groupId) / itemsList.length,
            none:this.getItemsByStatusId(4,groupId) / itemsList.length,
        }
    }

    //--------------------------------
    // getTasksByStatusId
    //---------------------------------

    getItemsByStatusId(statusId:number,groupId:string):number{
        let filtered = this.itemList.filter((item)=>{
           return item.data.statusId === statusId && item.data.groupId === groupId && item.data.parentId === "-1"
        })
        return filtered.length
    }

    //--------------------------------
    // getStatusClassNameById
    //---------------------------------

    getStatusClassNameById(statusId:number):string{
        return Object.keys(eStatusClassName)[Object.values(eStatusClassName).indexOf(statusId)];
    }

    //--------------------------------
    // addItem
    //---------------------------------

    addItem(itemName:string,groupId:string,callback:Function){
        let newItem:IItem = {
            boardId:"1",
            id:new Date().getTime().toString(),
            data:{
                children:[],
                name:itemName,
                statusId:4,
                members:[],
                date:new Date().setHours(0,0,0,0),
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
                this.eventEmitter.emit("items-change",groupId);
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //--------------------------------
    // addSubItem
    //---------------------------------

    addSubItem(parent:IItem,callback:Function){
        let newSubItem:IItem = {
            boardId:"1",
            id:new Date().getTime().toString(),
            data:{
                children:[],
                name:"Sub item",
                statusId:4,
                members:[],
                date:new Date().setHours(0,0,0,0),
                groupId:parent.data.groupId,
                parentId:parent.id,
            }
        }
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/${newSubItem.boardId}/addSubItem/${newSubItem.id}`,
            data: {
                "data":JSON.stringify(newSubItem),
            },
            success: (result) => {
                this.itemList = result
                this.eventEmitter.emit("items-change",newSubItem.data.groupId);
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

    editItemStatusId(item:IItem,statusId:number,callback:Function){
        console.log(item)
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/88/1/status/${item.id}`,
            data: {
                "data":statusId.toString(),
            },
            success: (result) => {
                this.itemList = result
                this.eventEmitter.emit("items-change", item.data.groupId);
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //--------------------------------
    // editItemDateId
    //---------------------------------

    editItemDateId(selectedDatesNumber:number,item:IItem,callback:Function){
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/88/1/date/${item.id}`,
            data: {
                "data":selectedDatesNumber.toString(),
            },
            success: (result) => {
                this.itemList = result
                this.eventEmitter.emit("items-change",item.data.groupId);
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //--------------------------------
    // editItemDateId
    //---------------------------------

    getDoneItems(groupId:string){
        let filterd = this.itemList.filter((item)=>{
            return item.data.statusId === 3 && item.data.groupId === groupId && item.data.parentId === "-1"
        });
        return filterd
    }

    //--------------------------------
    // deleteItem
    //---------------------------------

    deleteItem(item:IItem,callback:Function){
        $.ajax({
            type: "DELETE",
            url: `http://localhost:3000/88/1/delete/${item.id}`,
            data: {
                "data":JSON.stringify(item),
            },
            success: (result) => {
                this.itemList = result
                this.eventEmitter.emit("items-change",item.data.groupId);
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //--------------------------------
    // duplicateItem
    //---------------------------------

    duplicateItem(item:IItem,callback:Function){
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/1/duplicateItem/${item.id}`,
            data: {
                "data":JSON.stringify(item),
            },
            success: (result) => {
                debugger;
                this.itemList = result
                this.eventEmitter.emit("items-change",item.data.groupId);
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