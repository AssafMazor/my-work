import { ITask } from "../interfaces/task.interface"
import {EventEmitter} from 'events';
import moment from "moment";
import { isEmpty } from "lodash";

export class TasksService {
    private static _instance: TasksService;

    eventEmitter:EventEmitter;
    taskList:ITask[];

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.taskList = require("../data/tasks.json");
    }

    //----------------------------------
    // laodData
    //----------------------------------
    
    laodData(callback){
        setTimeout(()=>{
            this.taskList = require("../data/tasks.json");
            callback();
        }, 1000)
    }

    //----------------------------------
    // returnNewTask
    //----------------------------------

    returnNewTask():ITask{
        return  {
            "name": "",    
            "title":"",
            "isToday":false,
            "parentId":"-1",
            "sentTime":new Date().getTime(),
            "labels":[],
            "isfinished":false,
            "priority":4,
            "category":1,
            "id":new Date().getTime().toString(),
            "children":[],
            "sectionId":"-1"
        }
    }

    //----------------------------------
    // getAllTasks
    //----------------------------------

    getAllTasks():ITask[]{
        return this.taskList
    }

    //----------------------------------
    // getTasks
    //----------------------------------

    getTasks():ITask[]{
        return this.getTasksBySection("-1");
    }

    //----------------------------------
    // getTasksBySection
    //----------------------------------

    getTasksBySection(sectionId:string):ITask[]{
        let fillterd = this.taskList.filter((task) => {
            return task.sectionId === sectionId && task.parentId === "-1"
        });
        return fillterd;
    }

    //----------------------------------
    // getTask
    //----------------------------------

    getTask(taskId:string):ITask | null{
        let fillterd = this.taskList.filter((task)=> { 
            return task.id === taskId;
        });
        return !isEmpty(fillterd) ? fillterd[0] : null;
    }

    //----------------------------------
    // getCompletedTask
    //----------------------------------

    getCompletedTask(taskId:string):ITask{
        let fillterd = this.taskList.filter((task)=> { 
            return task.id === taskId
        });
        return fillterd[0];
    }

    removeLabelsFromTasks(labelId:number,callback:Function){
        setTimeout(()=>{
            this.taskList.filter((task:ITask) => {
                task.labels = task.labels.filter((id) => {
                    return id !== labelId
                })
            })    
            callback();
        },150)
    }
    
    //----------------------------------
    // getCompletedTasksList
    //----------------------------------

    getCompletedTasksList(sectionId:string):ITask[]{
        let fillterd = this.taskList.filter((task)=> { 
            return task.isfinished && task.sectionId === sectionId
        });
        return fillterd
    }

    //----------------------------------
    // getTasksByLabelId
    //----------------------------------

    getTasksByLabelId(labelId:number):ITask[]{
        let fillterd = this.taskList.filter((task) => {
            return task.labels.includes(labelId);
        })
        return fillterd
    }

    //----------------------------------
    // getTasksByDate
    //----------------------------------

    getTasksByDate(day:number):ITask[]{
        let start = moment(day).startOf('day').valueOf();
        let end = moment(day).endOf('day').valueOf();
    
        let fillterd = this.taskList.filter((task) => {
            return task.sentTime >= start && task.sentTime < end;
        })
        return fillterd;
    }

    //----------------------------------
    // getOverDueTasks
    //----------------------------------

    getOverDueTasks():ITask[]{
        let fillterd = this.taskList.filter((task) => {
            return new Date(task.sentTime).getDate() === new Date().getDate() - 1
        })
        return fillterd;
    }

    //----------------------------------
    // addTaskLabels
    //----------------------------------

    addTaskLabels(taskId:string , choosenLabels:number[]){
        let task = this.getTask(taskId);
        if(task){
            choosenLabels.forEach((id) => {
                if(!(task!).labels.includes(id)){
                    task!.labels.push(id);
                }
            })
        }
        this.eventEmitter.emit('task-change');
    }

    //----------------------------------
    // addTasknewLabels
    //----------------------------------

    addTasknewLabels(taskId:string , choosenLabels:number[]){
        let task = this.getTask(taskId);
        if(task){
            choosenLabels.forEach((id) => {
                if(!(task!).labels.includes(id)){
                    task!.labels.push(id);
                }
            })
        }
        this.eventEmitter.emit('task-change');
    }

    //----------------------------------
    // addNewTask
    //----------------------------------

    addNewTask(newTask:ITask){
        this.taskList.push(newTask);
        this.eventEmitter.emit('task-change');
    }
    
    //----------------------------------
    // addSubTask
    //----------------------------------

    addSubTask(newSubTask:ITask , task:ITask){
        this.taskList.push(newSubTask);
        task.children.push(newSubTask.id);

        this.eventEmitter.emit('addNewSubTask', task, newSubTask);
    }

    //----------------------------------
    // getTaskLabels
    //----------------------------------

    getTaskLabels(labelId:number){
        let fillterd = this.taskList.filter((task) => {
            return task.labels.includes(labelId)
        })
        this.eventEmitter.emit('task-change', fillterd);
    }

    //----------------------------------
    // getLabelTaskLength
    //----------------------------------

    getLabelTaskLength(labelId:number):number{
        var fillterd = this.taskList.filter((task) => {
            return task.labels.includes(labelId);
        })
        return fillterd.length
    }

    //----------------------------------
    // getNotFinishedTasks
    //----------------------------------

    getNotFinishedTasks(){
        let fillterd = this.taskList.filter((task) => {
            return !task.isfinished && task.parentId === "-1"
        })
        return fillterd
    }

    //----------------------------------
    // editTask
    //----------------------------------

    editTask(editedTask:ITask){
        let task = this.getTask(editedTask.id);

        if(task){
            task.category = editedTask.category;
            task.id = editedTask.id;
            task.isfinished = editedTask.isfinished;
            task.labels = editedTask.labels;
            task.name = editedTask.name;
            task.priority = editedTask.priority;
            task.sentTime = editedTask.sentTime;
            task.title = editedTask.title;
            task.children = editedTask.children;    
        }
        this.eventEmitter.emit('task-change');
    }

    //----------------------------------
    // finishTask
    //----------------------------------

    finishTask(task:ITask){
        task.isfinished = true;
        this.eventEmitter.emit('task-change');
    }

    //----------------------------------
    // getCompletedTasks
    //----------------------------------

    getCompletedTasks(){
        let fillterd = this.taskList.filter((task) => {
            return task.isfinished
        });
        return fillterd
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

