import { ITask } from "../interfaces/task.interface"
import {EventEmitter} from 'events';
import moment from "moment";
import { isEmpty } from "lodash";

export class TasksService {
    private static _instance: TasksService;

    eventEmitter:EventEmitter;
    taskList:ITask[] = [];

    constructor() {
        this.eventEmitter = new EventEmitter();
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

    //----------------------------------
    // removeLabelsFromTasks
    //----------------------------------

    removeLabelsFromTasks(labelId:string,callback:Function){
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

    getTasksByLabelId(labelId:string):ITask[]{
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

    addTaskLabels(taskId:string , choosenLabels:string[],callback:Function){
        setTimeout(() => {
            let task = this.getTask(taskId);
            if(task){
                choosenLabels.forEach((id:string) => {
                    if(!(task!).labels.includes(id)){
                        task!.labels.push(id);
                    }
                })
            }
            this.eventEmitter.emit('task-change');
            callback()
        }, 0); 
    }

    //----------------------------------
    // addTasknewLabels
    //----------------------------------

    addTasknewLabels(taskId:string , choosenLabels:string[],callback:Function){
        setTimeout(() => {
            let task = this.getTask(taskId);
            if(task){
                choosenLabels.forEach((id:string) => {
                    if(!(task!).labels.includes(id)){
                        task!.labels.push(id);
                    }
                })
            }
            this.eventEmitter.emit('task-change');
            callback()
        }, 0);
    }

    //----------------------------------
    // addNewTask
    //----------------------------------

    addNewTask(newTask:ITask,callback:Function){
        setTimeout(()=>{
            this.taskList.push(newTask);
            this.eventEmitter.emit('task-change');
            callback()
        },0)
    }
    
    //----------------------------------
    // addSubTask
    //----------------------------------

    addSubTask(newSubTask:ITask , task:ITask,callback:Function){
        setTimeout(()=>{
            this.taskList.push(newSubTask);
            task.children.push(newSubTask.id);
    
            this.eventEmitter.emit('addNewSubTask', task, newSubTask);
            callback()
        },0)
    }

    //----------------------------------
    // getTaskLabels
    //----------------------------------

    getTaskLabels(labelId:string){
        let fillterd = this.taskList.filter((task:ITask) => {
            return task.labels.includes(labelId)
        })
        this.eventEmitter.emit('task-change', fillterd);
    }

    //----------------------------------
    // getLabelTaskLength
    //----------------------------------

    getLabelTaskLength(labelId:string):number{
        var fillterd = this.taskList.filter((task:ITask) => {
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
    // duplicateTask
    //----------------------------------

    duplicateTask(task:ITask,callback:Function){
        setTimeout(()=>{
          let subtasksIds:string[] = [];
          this.getTaskChildrenIds(task.id, subtasksIds)

          subtasksIds.forEach((subTaskId)=>{
            let copySubTask = JSON.parse(JSON.stringify(this.getTask(subTaskId)));
            copySubTask.id = copySubTask.id + "_1"

            if(copySubTask.parentId !== "-1"){
                copySubTask.parentId = copySubTask.parentId + "_1"
            };
            
            let children = JSON.parse(JSON.stringify(copySubTask.children));
            copySubTask.children = [];

            children.forEach((childId:string) =>{
                copySubTask.children.push(childId + "_1");
            });

            this.taskList.push(copySubTask);
          })
          this.eventEmitter.emit('task-change');
          callback()
        },0)
    }
    
    //----------------------------------
    // getSubTasks
    //----------------------------------

    getTaskChildrenIds(taskId:string,subTaskIdsArr:string[]){
        let task = this.getTask(taskId);
        if(task){
            subTaskIdsArr.push(task.id);        

            task.children.forEach((childId:string) => {
                this.getTaskChildrenIds(childId,subTaskIdsArr)
            })
        }
    }

    //----------------------------------
    // editTask
    //----------------------------------

    editTask(editedTask:ITask,callback:Function){
        setTimeout(() =>{
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
            callback()
        },0)   
    }

    //----------------------------------
    // finishTask
    //----------------------------------

    finishTask(task:ITask,callback:Function){
        setTimeout(()=>{
            task.isfinished = true;
            this.eventEmitter.emit('task-change');
            callback()
        }, 20)
    }

    //----------------------------------
    // deleteTask
    //----------------------------------

    deleteTask(taskId:string,callback:Function){
        setTimeout(() => {
            let subTaskIdsArr:string[] = [];
            this.getTaskChildrenIds(taskId,subTaskIdsArr);

            this.taskList = this.taskList.filter((task) => {
                return !subTaskIdsArr.includes(task.id)
            })
    
            this.eventEmitter.emit('task-change');
            callback()
        }, 50);
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

