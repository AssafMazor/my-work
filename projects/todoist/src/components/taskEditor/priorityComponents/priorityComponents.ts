import $ from 'jquery';
import { isEmpty } from 'lodash';
import { ITask } from "../../../interfaces/task.interface";
import { CommonService , IPosition } from '../../../services/common.service';

export interface IPriorityParams {
    parent: any,
    task:ITask,
  }
  
import '../priorityComponents/priorityComponents.scss';
const priorityTemplate = require('../priorityComponents/priorityComponents.hbs');

export class PriorityComponents {
    private commonService:CommonService = CommonService.Instance
    private $el:any;
    private parent:any
    private task:ITask

    constructor(params:IPriorityParams){
        this.parent = params.parent
        this.task = params.task

        this.setHtml();
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
        this.$el = $(priorityTemplate({}));

        this.parent.$el.find(".priority-dialog").html(this.$el);

        this.commonService.getPotions(this.parent.$el ,<IPosition>{
            btnClass:".priority-btn-wrap",
            dialogClass:".priority-list"
        });
        this.initEvents();
    }
    
    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.on("click" , (e) => {
            this.onPopperClick(e);
        })
        this.$el.find(".priority-item").on("click" , (e) => {
            this.onItemSelect(e); 
        })
    }

    //----------------------------------
    // onPopperClick
    //----------------------------------

    onPopperClick(e){
        if(isEmpty($(e.target).closest(".priority-list"))){
          this.parent.$el.find(".priority-list").addClass("hide");
          this.$el.addClass("hide")
        }
    }

    //----------------------------------
    // onToggleItemSelect
    //----------------------------------

    onItemSelect(e){
        this.parent.onChoosePriorities($(e.target).closest(".priority-item").data("id") , $(e.target).closest(".priority-item").data("name"));

        this.parent.$el.find(".priority-list").addClass("hide");
        this.$el.addClass("hide")
    }
}