import $ from 'jquery';
import { IPriority } from "../interfaces/priority.interface"
import {EventEmitter} from 'events';


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

    public static get Instance(){
        return this._instance || (this._instance = new this());
    } 
}
