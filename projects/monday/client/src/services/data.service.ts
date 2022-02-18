import { ItemService } from "./item.service";
import { GroupService } from "./group.service";
import { MemberService } from "./member.service";
import { BoardService } from "./board.service";

export class DataService {
    private static _instance: DataService;
    private itemService:ItemService = ItemService.Instance;
    private groupService:GroupService  = GroupService.Instance;
    private memberService:MemberService  = MemberService.Instance;
    private boardService:BoardService  = BoardService.Instance;

    constructor(){ 
    }

    loadData(callback){
      this.itemService.laodData(()=>{
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