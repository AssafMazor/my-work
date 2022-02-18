import $ from "jquery"
import { ILabel} from "../interfaces/label.interface"
import {EventEmitter} from 'events';
import { TasksService } from "./tasks.service";


export class LabelsService {   
    private static _instance: LabelsService;
    private tasksService:TasksService = TasksService.Instance;

    eventEmitter:EventEmitter;
    labelList:ILabel[] = [];
    userId:string|null;

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.userId = window.localStorage.getItem('userId')
    }

    //----------------------------------
    // laodData
    //----------------------------------

    laodData(callback){
        $.ajax({
            type: "get",
            url: `http://localhost:3000/${this.userId}/labels`,
            success: (result) => {
                this.labelList = result;
                callback();
            },
            error: () => {
                return;
            }
        });
    }

    //----------------------------------
    // getLabels
    //----------------------------------

    getLabels():ILabel[]{
        return this.labelList;
    }

    //----------------------------------
    // getLabelByName
    //----------------------------------

    getLabelByName(labelName:string):ILabel{
        let fillterd = this.labelList.filter((label:ILabel) => {
            return label.data.name === labelName
        })
        return fillterd[0]
    }

    //----------------------------------
    // getLabel
    //----------------------------------

    getLabel(labelId:string):ILabel{
        let fillterd = this.labelList.filter((label) => {
            return label.id === labelId
        })
        return fillterd[0]
    }

    //----------------------------------
    // isLabelExist
    //----------------------------------

    isLabelExist(labelName:string):ILabel[]{
        let fillterd = this.labelList.filter((label) => {
            return label.data.name === labelName
        })
        return fillterd
    }

    //----------------------------------
    // createNewLabel
    //----------------------------------

    createNewLabel(label:ILabel,callback:Function){
        $.ajax({
            type: "POST",
            url: `http://localhost:3000/${this.userId}/createLabel/${label.id}`,
            data:{
                data:JSON.stringify(label)
            },
            success: (result) => {
                this.labelList = result
                this.eventEmitter.emit('label-change', this.labelList);
                callback()
            },
            error: () => {
                return;
            }
        });
    }
    
    //----------------------------------
    // saveLabel
    //----------------------------------

    saveLabel(inputName:string,labelId:string,callback:Function){
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/${this.userId}/editLabel/${labelId}`,
            data:{
                data:inputName
            },
            success: (result) => {
                this.labelList = result
                this.eventEmitter.emit('label-change', this.labelList);
                callback()
            },
            error: () => {
                return;
            }
        });        
    }

    //----------------------------------
    // deleteLabel
    //----------------------------------

    deleteLabel(deletedLabelId:string,callback:Function){
        $.ajax({
            type: "DELETE",
            url: `http://localhost:3000/${this.userId}/deleteLabel/${deletedLabelId}`,
            success: (result) => {
                this.labelList = result.labels
                this.eventEmitter.emit('label-change', this.labelList);
                this.tasksService.taskList = result.tasks
                this.tasksService.eventEmitter.emit('task-change')
                callback()
            },
            error: () => {
                return;
            }
        });        
    }

    //----------------------------------
    // getFavoriteLabels
    //----------------------------------

    getFavoriteLabels():ILabel[]{
        let fillterd = this.labelList.filter((label) => {
            return label.data.favorite
        })
        return fillterd
    }

    //----------------------------------
    // toggleFavoriteLabel
    //----------------------------------

    toggleFavoriteLabel(labelId:string,callback:Function){
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/${this.userId}/toggleFavoriteLabel/${labelId}`,
            success: (result) => {
                this.labelList = result
                this.eventEmitter.emit('label-change', this.labelList);
                callback()
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

