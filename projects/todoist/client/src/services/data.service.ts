import { TasksService } from"../services/tasks.service";
import { LabelsService } from"../services/labels.service";
import { SectionsService } from '../services/section.service'; 
import { PriorityService } from "./priority.service";

export class DataService {
    private static _instance: DataService;
    private tasksService:TasksService = TasksService.Instance;
    private labelService:LabelsService  = LabelsService.Instance;
    private priorityService:PriorityService  = PriorityService.Instance;
    private sectionsService:SectionsService  = SectionsService.Instance;

    constructor(){ 
    }

    loadData(callback){
      this.tasksService.laodData(()=>{
        this.sectionsService.laodData(()=>{
          this.priorityService.loadData(()=>{
            this.labelService.laodData(()=>{  
              callback();  
            });  
          })
        });
      });      
    }

    public static get Instance(){
      return this._instance || (this._instance = new this());
    }
}