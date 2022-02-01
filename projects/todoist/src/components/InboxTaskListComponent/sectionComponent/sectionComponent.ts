import $ from 'jquery';
import { ITask } from "../../../interfaces/task.interface";
import { ISection } from "../../../interfaces/section.interface";
import { TasksService } from "../../../services/tasks.service";
import { TaskEditorComponent, eTaskMode } from "../../taskEditor/taskEditorComponent";
import { TaskListItemComponents } from "../../taskListItem/taskListItem";
import { SectionsService } from '../../../services/section.service';

import '../sectionComponent/sectionComponent.scss';
const sectionTemplate = require('../sectionComponent/sectionComponent.hbs');

export enum eSectionMode {
  section,
  taskList
}

export class SectionComponent {
    private tasksService:TasksService = TasksService.Instance;
    private sectionsService:SectionsService = SectionsService.Instance;
    private section:ISection;
    private $el:any;
    private parent:any;
    private isNotSection:boolean = false;
    private showComplete:boolean;

    constructor(section:ISection| null , parent:any ,isNotSection:eSectionMode , showComplete:boolean){
      this.section = section || {
        id: "-1",
        name: ""
      };
      this.showComplete = showComplete
      this.isNotSection = isNotSection === eSectionMode.taskList;
      this.parent = parent;
      this.setHtml();

      this.tasksService.eventEmitter.on("toggle-completed-tasks" , (completedTasksList) => {
        this.renderSectionTasks();
      })
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      let sectionListLength = this.tasksService.getTasksBySection(this.section.id).length

      this.$el = $(sectionTemplate({
        section:this.section,
        isNotSection:this.isNotSection,
        sectionListLength:sectionListLength,
        isSectionListLengthUnderZero:sectionListLength === 0
      }))
      
      this.parent.$el.find(".inbox-task-list-body").append(this.$el);

      this.renderSectionTasks();
      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".toggle-btn").on("click" , (e) => {
        this.onToggleBtnClick(e);
      });
      this.$el.find(".section-add-line").on("click" , (e) => {
        this.onAddSectionDialogClick(e);
      });
      this.$el.find(".add-section-cancel-btn").on("click" , (e) => {
        this.onCancelSectionBtnClick(e);
      });
      this.$el.find(".add-section-input").on("input" , (e) => {
        this.onAddSectionInputChange(e);
      });
      this.$el.find(".add-section-btn").on("click" , (e) => {
        this.onAddSectionBtnClick(e);
      });
      this.$el.find(".add-task-wrap").on("click" , (e) => {
        this.onAddTaskClick(e);

      });
    }

    //----------------------------------
    // onToggleBtnClick
    //----------------------------------
    
    onToggleBtnClick(e){
      e.preventDefault();

      this.$el.find(".item").toggleClass("hide");
      this.$el.find(".toggle-btn").toggleClass("hide");
    }

    //----------------------------------
    // onAddSectionBtnClick
    //----------------------------------

    onAddSectionBtnClick(e){
      let section = this.sectionsService.returnNewSection(this.$el.find(".add-section-input").val());
      new SectionComponent(section , this.parent , eSectionMode.section , false);
      this.$el.find(".add-section-wrap").addClass("hide");
      this.$el.find(".section-add-line").removeClass("hide");
    }

    //----------------------------------
    // onAddTaskClick
    //----------------------------------

    onAddTaskClick(e){
      let $wrap = this.$el.find(".new-editor-wrap");
      $wrap.removeClass("hide");

      new TaskEditorComponent({
        $wrap:$wrap, 
        parent:this,
        task:this.tasksService.returnNewTask(),
        isAddMode:eTaskMode.Add,
        isAddSubTask:false,
        parentSectionId:this.section.id
      });

      this.$el.find(".add-task-dialog").removeClass("hide");
      this.$el.find(".task-list-footer .add-task-wrap").addClass("hide");
    }

    //----------------------------------
    // onCancelSectionBtnClick
    //----------------------------------

    onCancelSectionBtnClick(e){
      $(".add-section-wrap").addClass("hide");
      $(".section-add-line").removeClass("hide");
    }

    //----------------------------------
    // onAddSectionDialogClick
    //----------------------------------

    onAddSectionDialogClick(e){
      this.$el.find(".add-section-wrap").removeClass("hide");
      this.$el.find(".section-add-line").addClass("hide");
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
    // renderTask
    //----------------------------------

    renderSectionTasks(){
      let sectionTasksList = this.tasksService.getTasksBySection(this.section.id);

      sectionTasksList.forEach((task) => {
        this.renderTask(task , this.$el.find(".section-task-list") , 0)
      })
    }

    //----------------------------------
    // renderTask
    //----------------------------------

    renderTask(task:ITask , $parentEl:any , level:number){
      if(task.isfinished && !this.showComplete){
        return;
      }

      new TaskListItemComponents({
        task:task, 
        parent:this, 
        $host:$parentEl, 
        level:level,
        isToday:false
      });
   
      let $el = this.$el.find(`.section-task-list .item[data-id="${task.id}"]`)
      
      task.children.forEach((taskId:string) => {
        let subtask = this.tasksService.getTask(taskId);
        if(subtask){
          this.renderTask(subtask , $el , level + 1)
        }
      });
    }
}