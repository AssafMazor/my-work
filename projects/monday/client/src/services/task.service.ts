import $ from "jquery";;

export class TaskService {
    private static _instance: TaskService;

    constructor(){
    }
    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}