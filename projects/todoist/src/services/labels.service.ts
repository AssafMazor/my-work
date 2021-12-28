import $ from 'jquery';
import { get } from 'lodash';
import { ILabel} from "../interfaces/label.interface"
import {EventEmitter} from 'events';


export class LabelsService {
    
    t:string  = "ttt";
    onLabelChangeEvent = new EventEmitter();
    labels:ILabel[] = [];

    constructor() {
        debugger;
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        this.getLabelsArray(); 

    }

    getLabelsArray() {
        if(!this.labels) {
        $.getJSON("./data/labels.json", (labels:ILabel[]) => {
            this.labels = labels;
        });
        }else {
        }
    }
}