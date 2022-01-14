import $ from 'jquery';
import { isEmpty } from 'lodash';
import { ITask } from "../../../../interfaces/task.interface";
import { LabelsService } from "../../../../services/labels.service";
import { TasksService } from "../../../../services/tasks.service";

export interface IPriorityParams {
    parent: any,
    task:ITask,
  }
  
import '../priorityComponents/priorityComponents.scss';
const priorityTemplate = require('../priorityComponents/priorityComponents.hbs');

export class priorityComponents {
    private labelsService:LabelsService = LabelsService.Instance;
    private tasksService:TasksService = TasksService.Instance;
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

        this.prioritiesListPosition();
        this.initEvents();
    }

    //----------------------------------
    // priorityListPosition
    //----------------------------------

    prioritiesListPosition(){
        let top:number;
        let left:number;
        let bottom:number;
        let offset = this.parent.$el.find(".priority-icon").offset();
        let prioritiesBtnHeigth = this.parent.$el.find(".priority-icon").height();
        let pageHeigth =  window.innerHeight;
        let prioritiesListHeigth = this.parent.$el.find(".priority-list").height();
        
        if(pageHeigth - (offset.top + prioritiesListHeigth) > 0){
          top = offset.top + prioritiesBtnHeigth;
          left = offset.left - 100;
          this.parent.$el.find(".priority-list").css('top' , top)
        }else {
          bottom = pageHeigth - offset.top;
          left = offset.left - 100;
          this.parent.$el.find(".priority-list").css('bottom' , bottom)
        }
        this.parent.$el.find(".priority-list").css('left' , left)
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