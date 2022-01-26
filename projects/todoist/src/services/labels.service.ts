import $ from 'jquery';
import { ILabel} from "../interfaces/label.interface"
import {EventEmitter} from 'events';
import { fill } from 'lodash';


export class LabelsService {   
    private static _instance: LabelsService;

    eventEmitter:EventEmitter;
    labels:ILabel[];

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.labels = [];
        this.labels = require("../data/labels.json");
    }

    laodData(callback){
        setTimeout(()=>{
            this.labels = require("../data/labels.json");
            callback();
        }, 250)
    }

    getLabels():ILabel[]{
        return this.labels;
    }

    getLabel(labelId:number):ILabel{
        let fillterd = this.labels.filter((label) => {
            return label.id === labelId
        })
        return fillterd[0]
    }

    isLabelExist(labelName:string):ILabel[]{
        let fillterd = this.labels.filter((label) => {
            return label.name === labelName
        })
        return fillterd
    }

    createNewLabel(label:ILabel){
        console.log(label)
        this.labels.push(label)
        this.eventEmitter.emit('label-change', this.labels);
    }
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

