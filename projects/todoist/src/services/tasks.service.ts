import { ITask } from "../interfaces/task.interface"
import {EventEmitter} from 'events';
import moment from "moment";

export class TasksService {
    private static _instance: TasksService;

    eventEmitter:EventEmitter;
    taskList:ITask[];

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.taskList = require("../data/tasks.json");
    }
    
    laodData(callback?){
        setTimeout(()=>{
            this.taskList = require("../data/tasks.json");
            callback();
        }, 1000)
    }
    
    returnNewTask():ITask{
        return  {
            "name": "string",    
            "title":"string",
            "isToday":false,
            "parentId":"-1",
            "sentTime":new Date().getTime(),
            "labels":[],
            "isfinished":false,
            "priority":4,
            "category":1,
            "id":new Date().getTime().toString(),
            "children":[]
        }
    }

    getAllTasks():ITask[]{
        return this.taskList
    }

    getTasks():ITask[]{
        var fillterd = this.taskList.filter((task) => {
            return !task.isfinished && task.category === 1 && task.parentId === "-1"
        });
        return fillterd;
    }

    getTask(taskId:string):ITask{
        let fillterd = this.taskList.filter((task)=> { 
            return task.id === taskId
        });
        return fillterd[0];
    }

    getTasksByDate(day:number):ITask[]{
        let start = moment(day).startOf('day').valueOf();
        let end = moment(day).endOf('day').valueOf();
    
        let fillterd = this.taskList.filter((task) => {
            return task.sentTime >= start && task.sentTime < end;
        })
        return fillterd;
    }
    
    addTaskLabels(taskId:string , choosenLabels:number[]){
        let task = this.getTask(taskId);
        choosenLabels.forEach((id) => {
            if(!task.labels.includes(id)){
                task.labels.push(id);
            }
        })
        this.eventEmitter.emit('task-change');
    }

    addTasknewLabels(taskId:string , choosenLabels:number[]){
        let task = this.getTask(taskId);
        choosenLabels.forEach((id) => {
            if(!task.labels.includes(id)){
                task.labels.push(id);
            }
        })
        this.eventEmitter.emit('task-change');
    }

    addNewTask(newTask:ITask){
        this.taskList.push(newTask);
        this.eventEmitter.emit('task-change');
    }

    addSubTask(newSubTask:ITask , task:ITask){
        this.taskList.push(newSubTask);
        task.children.push(newSubTask.id);

        this.eventEmitter.emit('addNewSubTask', task, newSubTask);
    }

    getTaskLabels(labelId:number){
        let fillterd = this.taskList.filter((task) => {
            return task.labels.includes(labelId)
        })
        this.eventEmitter.emit('task-change', fillterd);
    }

    getLabelTaskLength(labelId:number):number{
        var fillterd = this.taskList.filter((task) => {
            return task.labels.includes(labelId);
        })
        return fillterd.length
    }

    editTask(editedTask:ITask){
        let task = this.getTask(editedTask.id)

        task.category = editedTask.category;
        task.id = editedTask.id;
        task.isfinished = editedTask.isfinished;
        task.labels = editedTask.labels;
        task.name = editedTask.name;
        task.priority = editedTask.priority;
        task.sentTime = editedTask.sentTime;
        task.title = editedTask.title;
        task.children = editedTask.children;
        
        this.eventEmitter.emit('task-change');
    }

    finishTask(task:ITask){
        task.isfinished = !task.isfinished 
        this.eventEmitter.emit('task-change');
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

