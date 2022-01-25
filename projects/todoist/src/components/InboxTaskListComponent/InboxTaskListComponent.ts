import $ from 'jquery';
import { ITask } from "../../interfaces/task.interface";
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from "../../services/labels.service";
import { TaskEditorComponent, eTaskMode } from "../taskEditor/taskEditorComponent";
import { TaskListItemComponents } from "../taskListItem/taskListItem";
import { sectionComponent } from './sectionComponent/sectionComponent';

import '../InboxTaskListComponent/InboxTaskListComponent.scss';
const taskListTemplate = require('../InboxTaskListComponent/InboxTaskListComponent.hbs');

export class inboxTaskListComponent {
    private tasksService:TasksService = TasksService.Instance;
    private labelsService:LabelsService  = LabelsService.Instance;;
    private taskList: ITask[] = [];
    private $el:any;

    constructor(taskList:ITask[]){
      this.taskList = taskList
      this.setHtml();

      this.tasksService.eventEmitter.on('task-change', () => {
        this.taskList = this.tasksService.getTasks()
        this.renderAllTasks(this.$el.find(".inbox-task-list-body") , 0);
      });

      this.tasksService.eventEmitter.on("addNewSubTask" , (newSubTask:ITask, subTask:ITask) => {
        this.renderAllTasks(this.$el.find(".inbox-task-list-body") , 1)
      })

      this.tasksService.eventEmitter.on("toggle-completed-tasks" , (completedTasksList) => {
        this.renderCompletedTasks(completedTasksList);
      })
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(taskListTemplate({
        tasks:this.taskList,
      }))
      
      $(".main .container .task-list .inside-task-list").html(this.$el);

      this.initEvents();
      this.renderAllTasks(this.$el.find(".inbox-task-list-body") , 0);
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".add-task-wrap").on("click" , (e) => {
        this.onAddTaskClick(e);
        
      })
      this.$el.find(".item.show-completed-tasks").on("click" , (e) => {
        this.onItemShowCompletedTasksClick(e);
      })
      this.$el.find(".item.hide-completed-tasks").on("click" , (e) => {
        this.onItemHideCompletedTasksClick(e);
      })
      this.$el.find(".settings-btn").on("click" , (e) => {
      this.onSettingsBtnClick(e);
      })
      this.$el.find(".section-add-line").on("click" , (e) => {
        this.onAddSectionDialogClick(e);
      })
      this.$el.find(".add-section-cancel-btn").on("click" , (e) => {
        this.onCancelSectionBtnClick(e);
      })
      this.$el.find(".add-section-input").on("input" , (e) => {
        this.onAddSectionInputChange(e);
      })
      this.$el.find(".add-section-btn").on("click" , (e) => {
        this.onAddSectionBtnClick(e);
      })
    }

    //----------------------------------
    // onAddTaskClick
    //----------------------------------

    onAddTaskClick(e){
      let $wrap = $(".new-editor-wrap");
      $wrap.removeClass("hide");

      new TaskEditorComponent({
        $wrap:$wrap, 
        parent:this,
        task:this.tasksService.returnNewTask(),
        isAddMode:eTaskMode.Add,
        isAddSubTask:false
      });

      this.$el.find(".add-task-dialog").removeClass("hide");
      this.$el.find(".task-list-footer .add-task-wrap").addClass("hide");
    }

    //----------------------------------
    // onItemShowCompletedTasksClick
    //----------------------------------

    onItemShowCompletedTasksClick(e){
      this.tasksService.showCompletedTasks();

      this.$el.find(".show-completed-tasks").addClass("hide");
      this.$el.find(".hide-completed-tasks").removeClass("hide");
      this.$el.find(".settings-menu").addClass("hide");
    }
   
    //----------------------------------
    // onAddSectionBtnClick
    //----------------------------------

    onAddSectionBtnClick(e){
      new sectionComponent(this.$el.find(".add-section-input").val() , this);
      this.$el.find(".add-section-wrap").addClass("hide");
      this.$el.find(".section-add-line").removeClass("hide");
    }
    
    //----------------------------------
    // onItemShowCompletedTasksClick
    //----------------------------------

    onItemHideCompletedTasksClick(e){
      this.$el.find(".show-completed-tasks").removeClass("hide");
      this.$el.find(".hide-completed-tasks").addClass("hide");
      this.$el.find(".settings-menu").addClass("hide");
      this.$el.find(".completed-task-list").html("");
    }

    //----------------------------------
    // onCancelSectionBtnClick
    //----------------------------------

    onCancelSectionBtnClick(e){
      $(".add-section-wrap").addClass("hide");
      $(".section-add-line").removeClass("hide");
    }

    //----------------------------------
    // onCancelSectionBtnClick
    //----------------------------------

    onAddSectionInputChange(e){
      if(this.$el.find(".add-section-input").val() === ""){
        this.$el.find(".add-section-btn").addClass("disable");
      }else {
        this.$el.find(".add-section-btn").removeClass("disable");
      }
    }

    //----------------------------------
    // onItemShowCompletedTasksClick
    //----------------------------------

    onSettingsBtnClick(e){
      this.$el.find(".settings-menu").toggleClass("hide");
    }

    //----------------------------------
    // onAddSectionDialogClick
    //----------------------------------

    onAddSectionDialogClick(e){
      $(".add-section-wrap").removeClass("hide");
      $(".section-add-line").addClass("hide");
    }

    //----------------------------------
    // renderAllTasks
    //----------------------------------

    renderAllTasks($parentEl:any , level:number){    
      this.$el.find(".inbox-task-list-body").html("");

      this.taskList.forEach((task:ITask) => {
        this.renderTask(task , $parentEl , level);
      })
    }

    //----------------------------------
    // renderTask
    //----------------------------------

    renderTask(task:ITask , $parentEl:any , level:number){
        new TaskListItemComponents({
          task:task, 
          parent:this, 
          $host:$parentEl, 
          level:level,
          isToday:false
        });
        
        let $el = this.$el.find(`.inbox-task-list-body .item.${task.name}`)
        
        task.children.forEach((taskId:string) => {
          let subtask = this.tasksService.getTask(taskId)
          this.renderTask(subtask , $el , level + 1)
      });
    }

    //----------------------------------
    // renderCompletedTasks
    //----------------------------------

    renderCompletedTasks(completedTasksList:ITask[]){
      this.$el.find(".completed-tasks-title").removeClass("hide");
      this.$el.find(".completed-task-list").html("");

      if(completedTasksList.length === 0){
        this.$el.find(".completed-task-list").html("No completed tasks");
        this.$el.find(".completed-tasks-title").addClass("hide");
      }

      completedTasksList.forEach((task:ITask) => {
        debugger;
        this.renderCompletedTask(task , this.$el.find(".completed-task-list") ,0)
      })
    }      

    //----------------------------------
    // renderCompletedTask
    //----------------------------------

    renderCompletedTask(task:ITask , $parentEl:any , level:number){
      new TaskListItemComponents({
        task:task, 
        parent:this, 
        $host:$parentEl, 
        level:level,
        isToday:false
      });
      
      let $el = this.$el.find(`.completed-task-list .item.${task.name}`)
      
      task.children.forEach((taskId:string) => {
        let subtask = this.tasksService.getCompletedTask(taskId)
        this.renderCompletedTask(subtask , $el , level + 1)
      });
    }

}