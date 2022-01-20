import $ from 'jquery';
import { TaskEditorComponent, eTaskMode } from "../taskList/taskEditor/taskEditorComponent";
// import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
// import { LabelsService } from "../../services/labels.service";

import '../headerComponent/headerComponent.scss';
const headerTemplate = require('../headerComponent/headerComponent.hbs');

export class HeaderComponents {
    private tasksService:TasksService = TasksService.Instance;
    private $el:any;

    constructor(){
      this.setHtml();
    }

    setHtml(){
      this.$el = $(headerTemplate({}))
      $(".main .header").html(this.$el)

      this.initEvents();
    }
    
    initEvents(){
      $(".menu-btn").on("click" , (e) => {
        $(".main .menu").toggleClass("show")
      })
      $(".header .qiuck-add-task-wrap ").on("click" , (e) => {
        this.onQiuckTaskAdd(e);
      })
    }

    onQiuckTaskAdd(e){
          let $wrap = $(".new-editor-wrap");
          $wrap.removeClass("hide");

          new TaskEditorComponent({
            $wrap:$wrap, 
            parent:this,
            task:this.tasksService.returnNewTask(),
            isAddMode:eTaskMode.Add,
            showAsDialog:true,
            isAddSubTask:false
          });

        $(".add-task-dialog").removeClass("hide");
        $(".task-list-footer .add-task-wrap").addClass("hide");
    }

}