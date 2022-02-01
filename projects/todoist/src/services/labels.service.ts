import { ILabel} from "../interfaces/label.interface"
import {EventEmitter} from 'events';
import { TasksService } from "./tasks.service";


export class LabelsService {   
    private static _instance: LabelsService;
    private tasksService:TasksService = TasksService.Instance;

    eventEmitter:EventEmitter;
    labelList:ILabel[] = [];

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.labelList = require("../data/labels.json");
    }

    laodData(callback){
        setTimeout(()=>{
            this.labelList = require("../data/labels.json");
            callback();
        }, 250)
    }

    getLabels():ILabel[]{
        return this.labelList;
    }

    getLabelByName(labelName:string):ILabel{
        let fillterd = this.labelList.filter((label:ILabel) => {
            return label.name === labelName
        })
        return fillterd[0]
    }

    getLabel(labelId:string):ILabel{
        let fillterd = this.labelList.filter((label) => {
            return label.id === labelId
        })
        return fillterd[0]
    }

    isLabelExist(labelName:string):ILabel[]{
        let fillterd = this.labelList.filter((label) => {
            return label.name === labelName
        })
        return fillterd
    }

    createNewLabel(label:ILabel){
        this.labelList.push(label)
        this.eventEmitter.emit('label-change', this.labelList);
    }

    saveLabel(inputName:string,labelId:string){
        let label = this.getLabel(labelId);
        label.name = inputName;
        this.eventEmitter.emit('label-change', this.labelList);
    }

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

    getFavoriteLabels():ILabel[]{
        let fillterd = this.labelList.filter((label) => {
            return label.favorite
        })
        return fillterd
    }

    toggleFavoriteLabel(labelId:string){
        let label = this.getLabel(labelId);
        label.favorite = !label.favorite;
        this.eventEmitter.emit('label-change', this.labelList);
    }
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

