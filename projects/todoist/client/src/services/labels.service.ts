import $ from "jquery"
import { ILabel} from "../interfaces/label.interface"
import {EventEmitter} from 'events';
import { TasksService } from "./tasks.service";
import { debug } from "webpack";


export class LabelsService {   
    private static _instance: LabelsService;
    private tasksService:TasksService = TasksService.Instance;

    eventEmitter:EventEmitter;
    labelList:ILabel[] = [];

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.labelList = require("../data/labels.json");
    }

    //----------------------------------
    // laodData
    //----------------------------------

    laodData(callback){
        $.ajax({
            type: "get",
            url: 'http://localhost:3000/88/labels',
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
            url: `http://localhost:3000/88/createLabel/${label.id}`,
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
            url: `http://localhost:3000/88/editLabel/${labelId}`,
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
            url: `http://localhost:3000/88/deleteLabel/${deletedLabelId}`,
            success: (result) => {
                debugger;
                this.labelList = result
                this.eventEmitter.emit('label-change', this.labelList);
                callback()
            },
            error: () => {
                return;
            }
        });        
            this.labelList = this.labelList.filter((label) => {
                return label.id !== deletedLabelId
            })
            this.tasksService.removeLabelsFromTasks(deletedLabelId, () =>{
                this.eventEmitter.emit('label-change', this.labelList);     
                callback()
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
        setTimeout(()=>{
            let label = this.getLabel(labelId);
            label.data.favorite = !label.data.favorite;
            this.eventEmitter.emit('label-change', this.labelList);
            callback()
        },0)
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

