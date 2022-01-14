import { IPriority } from "../interfaces/priority.interface"
import {EventEmitter} from 'events';

export enum ePriorityColors {
   'red' = 1,
   'orange' = 2,
   'blue' = 3,
   'normal' = 4
};

export class PriorityService {   
    private static _instance: PriorityService;
    eventEmitter = new EventEmitter();
    priorityList:IPriority[] = [];

    constructor() {
        this.getPrioritysArray();
    }

    getPrioritysArray() {
        if(!this.priorityList) {
            var priorityList = require("../data/prioritys.json")
            this.priorityList = priorityList
            this.eventEmitter.emit("prioritys-change" , this.priorityList)
        }else {
            this.eventEmitter.emit("prioritys-change" , this.priorityList)
        }
    }

    getPriorityColor(priorityId:number){
        return  Object.keys(ePriorityColors)[Object.values(ePriorityColors).indexOf(priorityId)];
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    } 
}
