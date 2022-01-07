import $ from 'jquery';
import { ILabel} from "../interfaces/label.interface"
import {EventEmitter} from 'events';


export class LabelsService {   
    private static _instance: LabelsService;

    eventEmitter:EventEmitter;
    labels:ILabel[];

    constructor() {
        this.eventEmitter = new EventEmitter();
        this.labels = [];
    }

    laodData(callback){
        setTimeout(()=>{
            this.labels = require("../data/labels.json");
            callback();
        }, 250)
    }

    getLabels(){
        return this.labels;
    }

    getLabel(labelId){
        let fillterd = this.labels.filter((label) => {
            return label.id === labelId
        })
        return fillterd[0]
    }

    createNewLabel(label){
        this.labels.push(label)
        this.eventEmitter.emit('label-change', this.labels);
    }
    
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

