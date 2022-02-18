import $ from "jquery"
import { ISection } from "../interfaces/section.interface"
import {EventEmitter} from 'events';

export class SectionsService {
    private static _instance: SectionsService;

    eventEmitter:EventEmitter = new EventEmitter();
    sectionList:ISection[] = [];
    userId:string|null;

    constructor() {
        this.userId = window.localStorage.getItem('userId')
    }
    
    laodData(callback){
        $.ajax({
            type: "get",
            url: `http://localhost:3000/${this.userId}/sections`,
            success: (result) => {
                this.sectionList = result
                callback();
            },
            error: () => {
                return;
            }
        });
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

