import { ILabel} from "../interfaces/label.interface"
import {EventEmitter} from 'events';
import { TasksService } from "./tasks.service";
import { Callbacks } from "jquery";


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
        setTimeout(()=>{
            this.labelList = require("../data/labels.json");
            callback();
        }, 1000)
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
            return label.name === labelName
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
            return label.name === labelName
        })
        return fillterd
    }

    //----------------------------------
    // createNewLabel
    //----------------------------------

    createNewLabel(label:ILabel,callback:Function){
        setTimeout(()=>{
            this.labelList.push(label)
            this.eventEmitter.emit('label-change', this.labelList);
            callback()
        },0)
    }
    //----------------------------------
    // saveLabel
    //----------------------------------

    saveLabel(inputName:string,labelId:string,callback:Function){
        setTimeout(()=>{
            let label = this.getLabel(labelId);
            label.name = inputName;
            this.eventEmitter.emit('label-change', this.labelList);
            callback()
        },0) 
    }

    //----------------------------------
    // deleteLabel
    //----------------------------------

    deleteLabel(deletedLabelId:string,callback:Function){
        setTimeout(() => {
            this.labelList = this.labelList.filter((label) => {
                return label.id !== deletedLabelId
            })
            this.tasksService.removeLabelsFromTasks(deletedLabelId, () =>{
                this.eventEmitter.emit('label-change', this.labelList);     
                callback()
            });
        }, 0);
    }

    //----------------------------------
    // getFavoriteLabels
    //----------------------------------

    getFavoriteLabels():ILabel[]{
        let fillterd = this.labelList.filter((label) => {
            return label.favorite
        })
        return fillterd
    }

    //----------------------------------
    // toggleFavoriteLabel
    //----------------------------------

    toggleFavoriteLabel(labelId:string,callback:Function){
        setTimeout(()=>{
            let label = this.getLabel(labelId);
            label.favorite = !label.favorite;
            this.eventEmitter.emit('label-change', this.labelList);
            callback()
        },0)
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

