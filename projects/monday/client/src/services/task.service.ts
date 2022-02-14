import $ from "jquery";
import {EventEmitter} from 'events';
import { ITask } from "../interfaces/task.interface";

export enum eStatusColor {
    'Working on it' = 1,
    'Stuck' = 2,
    'Done' = 3,
    '' = 4
 };

export class TaskService {
    private static _instance: TaskService;
    private taskList:ITask[] = [];
    public eventEmitter:EventEmitter = new EventEmitter();

    constructor(){
    }

    //--------------------------------
    // laodData
    //---------------------------------
    
    laodData(callback:Function){
        $.ajax({
            type: "GET",
            url: `http://localhost:3000/88/1/tasks`,
            success: (result) => {
                this.taskList = result;
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

    getTask(taskId:string):ITask{
        let filtered = this.taskList.filter((task)=>{
            return task.id === taskId
        })[0]
        return filtered
    }

    //--------------------------------
    // getTasks
    //---------------------------------

    getTasks(){
        let filtered = this.taskList.filter((task)=>{
            return task.data.parentId === "-1"
        })
        return filtered;
    }

    //--------------------------------
    // getTasksByGroupId
    //---------------------------------

    getTasksByGroupId(groupId:string){
        let filter = this.taskList.filter((task)=>{
            return task.data.groupId === groupId
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
    // addTask
    //---------------------------------

    addTask(taskName:string,groupId:string,callback:Function){
        let newTask:ITask = {
            id:new Date().getTime().toString(),
            data:{
                children:[],
                name:taskName,
                statusId:4,
                members:[],
                date:new Date().getTime(),
                groupId:groupId,
                parentId:"-1",
            }
        }
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/88/1/addTask/${new Date().getTime().toString()}`,
            data: {
                "data":JSON.stringify(newTask),
            },
            success: (result) => {
                this.taskList = result
                this.eventEmitter.emit("tasks-change");
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

    addSubTask(parent:ITask,callback:Function){
        let newSubTask:ITask = {
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
            url: `http://localhost:3000/88/1/addSubTask/${newSubTask.id}`,
            data: {
                "data":JSON.stringify(newSubTask),
            },
            success: (result) => {
                this.taskList = result
                this.eventEmitter.emit("tasks-change");
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