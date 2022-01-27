import { ILabel} from "../interfaces/label.interface"
import {EventEmitter} from 'events';


export class LabelsService {   
    private static _instance: LabelsService;

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

    getLabel(labelId:number):ILabel{
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

    saveLabel(inputName:string,labelId:number){
        let label = this.getLabel(labelId);
        label.name = inputName;
        this.eventEmitter.emit('label-change', this.labelList);
    }

    deleteLabel(deletedLabel:ILabel){
        this.labelList = this.labelList.filter((label) => {
            return label !== deletedLabel
        })
        this.eventEmitter.emit('label-change', this.labelList);
    }
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

