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

    createEmptyTask():ITask{
        return  {
            "taskId":new Date().getTime().toString(),
            "data":{
                "name": "",    
                "title":"",
                "isToday":false,
                "parentId":"-1",
                "sentTime":new Date().getTime(),
                "labels":[],
                "isfinished":false,
                "priority":4,
                "category":1,
                "children":[],
                "sectionId":"-1"
            }
        }
    }


    //fetchTasks()

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
            return task.data.sectionId === sectionId && task.data.parentId === "-1"
        });
        return fillterd;
    }

    //----------------------------------
    // getTask
    //----------------------------------

    getTask(taskId:string):ITask | null{
        let fillterd = this.taskList.filter((task)=> { 
            return task.taskId === taskId;
        });
        return !isEmpty(fillterd) ? fillterd[0] : null;
    }

    //----------------------------------
    // getCompletedTask
    //----------------------------------

    getCompletedTask(taskId:string):ITask{
        let fillterd = this.taskList.filter((task)=> { 
            return task.taskId === taskId
        });
        return fillterd[0];
    }

    //----------------------------------
    // removeLabelsFromTasks
    //----------------------------------

    removeLabelsFromTasks(labelId:string,callback:Function){
        setTimeout(()=>{
            this.taskList.filter((task:ITask) => {
                task.data.labels = task.data.labels.filter((id) => {
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
            return task.data.isfinished && task.data.sectionId === sectionId
        });
        return fillterd
    }

    //----------------------------------
    // getTasksByLabelId
    //----------------------------------

    getTasksByLabelId(labelId:string):ITask[]{
        let fillterd = this.taskList.filter((task) => {
            return task.data.labels.includes(labelId);
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
            return task.data.sentTime >= start && task.data.sentTime < end;
        })
        return fillterd;
    }

    //----------------------------------
    // getOverDueTasks
    //----------------------------------

    getOverDueTasks():ITask[]{
        let fillterd = this.taskList.filter((task) => {
            return new Date(task.data.sentTime).getDate() === new Date().getDate() - 1
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
                    if(!(task!).data.labels.includes(id)){
                        task!.data.labels.push(id);
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
                    if(!(task!).data.labels.includes(id)){
                        task!.data.labels.push(id);
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
            task.data.children.push(newSubTask.taskId);
    
            this.eventEmitter.emit('addNewSubTask', task, newSubTask);
            callback()
        },0)
    }

    //----------------------------------
    // getTaskLabels
    //----------------------------------

    getTaskLabels(labelId:string){
        let fillterd = this.taskList.filter((task:ITask) => {
            return task.data.labels.includes(labelId)
        })
        this.eventEmitter.emit('task-change', fillterd);
    }

    //----------------------------------
    // getLabelTaskLength
    //----------------------------------

    getLabelTaskLength(labelId:string):number{
        var fillterd = this.taskList.filter((task:ITask) => {
            return task.data.labels.includes(labelId);
        })
        return fillterd.length
    }

    //----------------------------------
    // getNotFinishedTasks
    //----------------------------------

    getNotFinishedTasks(){
        let fillterd = this.taskList.filter((task) => {
            return !task.data.isfinished && task.data.parentId === "-1"
        })
        return fillterd
    }

    //----------------------------------
    // duplicateTask
    //----------------------------------

    duplicateTask(task:ITask,callback:Function){
        setTimeout(()=>{
          let subtasksIds:string[] = [];
          this.getTaskChildrenIds(task.taskId, subtasksIds)

          subtasksIds.forEach((subTaskId)=>{
            let copySubTask = JSON.parse(JSON.stringify(this.getTask(subTaskId)));
            copySubTask.id = copySubTask.id + "_1"

            if(copySubTask.data.parentId !== "-1"){
                copySubTask.data.parentId = copySubTask.data.parentId + "_1"
            };
            
            let children = JSON.parse(JSON.stringify(copySubTask.data.children));
            copySubTask.data.children = [];

            children.forEach((childId:string) =>{
                copySubTask.data.children.push(childId + "_1");
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
            subTaskIdsArr.push(task.taskId);        

            task.data.children.forEach((childId:string) => {
                this.getTaskChildrenIds(childId,subTaskIdsArr)
            })
        }
    }

    //----------------------------------
    // editTask
    //----------------------------------

    editTask(editedTask:ITask,callback:Function){
        setTimeout(() =>{
            let task = this.getTask(editedTask.taskId);

            if(task){
                task.taskId = editedTask.taskId;
                task.data = editedTask.data
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
            task.data.isfinished = true;
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
                return !subTaskIdsArr.includes(task.taskId)
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
            return task.data.isfinished
        });
        return fillterd     
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

