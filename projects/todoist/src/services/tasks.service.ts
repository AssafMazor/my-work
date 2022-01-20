import $ from 'jquery';
import { ITask } from "../interfaces/task.interface"
import {EventEmitter} from 'events';


export class TasksService {
    private static _instance: TasksService;

    eventEmitter:EventEmitter;
    taskList:ITask[];

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.taskList = [];
    }
    
    laodData(callback){
        setTimeout(()=>{
            this.taskList = require("../data/tasks.json");
            callback();
        }, 1000)
    }
    
    returnNewTask(){
        let id = this.taskList.length + 1
        return  {
            "name": "string",    
            "content":"string",
            "title":"string",
            "isToday":false,
            "parentId":"-1",
            "sentTime":new Date().getTime(),
            "labels":[],
            "isfinished":false,
            "priority":4,
            "category":1,
            "id":id.toString(),
            "level":0,
            "children":[]
        }
    }

    getAllTasks(){
        return this.taskList
    }

    getTasks() {
        var fillterd = this.taskList.filter((task) => {
            return !task.isfinished && task.category === 1 && task.parentId === "-1"
        })
        return fillterd;
    }

    getTask(taskId){
        let fillterd = this.taskList.filter((task)=> { 
            return task.id === taskId
        });
        return fillterd[0];
    }

    addTaskLabels(taskId , choosenLabels){
        let task = this.getTask(taskId);
        choosenLabels.forEach((id) => {
            if(!task.labels.includes(id)){
                task.labels.push(id);
            }
        })
        this.eventEmitter.emit('task-change');
    }

    addTasknewLabels(taskId , choosenLabels){
        let task = this.getTask(taskId);
        choosenLabels.forEach((id) => {
            if(!task.labels.includes(id)){
                task.labels.push(id);
            }
        })
        this.eventEmitter.emit('task-change');
    }

    addNewTask(newTask){
        console.log(newTask)
        this.taskList.push(newTask);
        this.eventEmitter.emit('task-change');
    }

    addSubTask(newSubTask , task){
        this.taskList.push(newSubTask);
        task.children.push(newSubTask.id);
        debugger;

        this.eventEmitter.emit('addNewSubTask', task, newSubTask);
    }

    getTaskLabels(labelId){
        let fillterd = this.taskList.filter((task) => {
            return task.labels.includes(labelId)
        })
        this.eventEmitter.emit('task-change', fillterd);
    }

    getLabelTaskLength(labelId){
        var fillterd = this.taskList.filter((task) => {
            return task.labels.includes(labelId);
        })
        return fillterd.length
    }

    editTask(editedTask){
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

    finishTask(task){
        task.isfinished = !task.isfinished 
        this.eventEmitter.emit('task-change');
    }

    // getTodayTasks(){
    //     debugger;
    //     let fillterd = this.taskList.filter((task) => {
    //         return task.isToday
    //     })
    //     this.eventEmitter.emit('category-change' , fillterd);
    // }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

