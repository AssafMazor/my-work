import $ from 'jquery';
import { Itask } from "../interfaces/task.interface"
import {EventEmitter} from 'events';
import { fill } from 'lodash';


export class TasksService {
    private static _instance: TasksService;

    eventEmitter:EventEmitter;
    taskList:Itask[];

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.taskList = [];
    }
    
    laodData(callback){
        setTimeout(()=>{
            this.taskList = require("../data/tasks.json");
            callback();
        }, 250)
    }

    getTasks() {
        var fillterd = this.taskList.filter((task) => {
            return !task.isfinished && task.category === 1
        })
        return fillterd;
    }

    getTask(taskId){
        var fillterd = this.taskList.filter((task)=> {
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
        this.getUpdatedTaskList()
    }

    addTasknewLabels(taskId , choosenLabels){
        let task = this.getTask(taskId);
        choosenLabels.forEach((id) => {
            if(!task.labels.includes(id)){
                task.labels.push(id);
            }
        })
        this.getUpdatedTaskList()
    }

    getUpdatedTaskList(){
        var fillterd = this.taskList.filter((task) => {
            return !task.isfinished && task.category === 1
        })
        this.eventEmitter.emit('task-change', fillterd);
    }

    getTaskByCategory(categoryType){
        if(!categoryType){
            categoryType === 1
        }
        var fillterd = this.taskList.filter((task) => {
            return !task.isfinished && task.category === categoryType
        })
        this.eventEmitter.emit('task-change', fillterd);
    }

    addNewTask(newTask){
        console.log(newTask)
        this.taskList.push(newTask)
        this.getUpdatedTaskList()
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
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
        
        this.getUpdatedTaskList();
    }
}

