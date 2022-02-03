import { ISection } from "../interfaces/section.interface"
import {EventEmitter} from 'events';

export class SectionsService {
    private static _instance: SectionsService;

    eventEmitter:EventEmitter;
    sectionList:ISection[] = [];

    constructor() {
        this.eventEmitter = new EventEmitter();
    }
    
    laodData(callback?){
        setTimeout(()=>{
            this.sectionList = require("../data/section.json");
            callback();
        }, 1000)
    }

    getSectionList(){
        return this.sectionList;
    }

    getSection(sectionId):ISection{
        let fillterd = this.sectionList.filter((section) => {
            return section.id === sectionId
        })
        return fillterd[0]
    }

    returnNewSection(sectionName:string):ISection{
        return {
            "name":sectionName,
            "id":new Date().getTime().toString()
        }
    }

    public static get Instance(){
        return this._instance || (this._instance = new this());
    }
}

