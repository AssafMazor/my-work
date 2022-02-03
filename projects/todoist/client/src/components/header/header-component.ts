import $ from 'jquery';
import { TaskEditorComponent, eTaskMode } from "../taskEditor/task-editor-component";
import { TasksService } from "../../services/tasks.service";

import '../header/header-component.scss';
const headerTemplate = require('../header/header-component.hbs');

export class HeaderComponents {
    private tasksService:TasksService = TasksService.Instance;
    private $el:any;

    constructor(){
      this.setHtml();
    }
    
    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(headerTemplate({}))
      $(".main .header").html(this.$el)

      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".menu-btn").on("click" , (e) => {
        $(".main .menu").toggleClass("show")
      })
      this.$el.find(".header .qiuck-add-task-wrap").on("click" , (e) => {
        this.onQiuckTaskAdd(e);
      })
      this.$el.find(".btn-test").on("click" , (e) => {
        fetch('http://localhost:3000/tasks')
          .then(data => {
            console.log(data);
          })
      })
    }

    //----------------------------------
    // onQiuckTaskAdd
    //----------------------------------

    onQiuckTaskAdd(e){
          let $wrap = $(".new-editor-wrap");
          $wrap.removeClass("hide");

          new TaskEditorComponent({
            $wrap:$wrap, 
            parent:this,
            task:this.tasksService.returnNewTask(),
            isAddMode:eTaskMode.Add,
            showAsDialog:true,
            isAddSubTask:false,
            parentSectionId:"-1"
          });

        $(".add-task-dialog").removeClass("hide");
        $(".task-list-footer .add-task-wrap").addClass("hide");
    } 
}