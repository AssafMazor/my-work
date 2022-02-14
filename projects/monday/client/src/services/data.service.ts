import { TaskService } from "./task.service";
import { GroupService } from "./group.service";
import { MemberService } from "./member.service";
import { boardService } from "./board.service";

export class DataService {
    private static _instance: DataService;
    private tasksService:TaskService = TaskService.Instance;
    private groupService:GroupService  = GroupService.Instance;
    private memberService:MemberService  = MemberService.Instance;
    private boardService:boardService  = boardService.Instance;

    constructor(){ 
    }

    loadData(callback){
      this.tasksService.laodData(()=>{
        this.groupService.laodData(()=>{
          this.memberService.loadData(()=>{
            this.boardService.laodData(()=>{  
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