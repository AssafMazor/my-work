import $ from "jquery"
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
    }

    loadData(callback:Function) {
        $.ajax({
            type: "get",
            url: 'http://localhost:3000/88/priorities',
            success: (result) => {
                debugger;
                this.priorityList = result;
                this.eventEmitter.emit("prioritys-change" , this.priorityList)     
                callback()
            },
            error: () => {
                return;
            }
        });
    }

    getPriorityColor(priorityId:number){
        return Object.keys(ePriorityColors)[Object.values(ePriorityColors).indexOf(priorityId)];
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    } 
}
