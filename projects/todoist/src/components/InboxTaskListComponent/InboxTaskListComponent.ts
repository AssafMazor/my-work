import $ from 'jquery';
import { ITask } from "../../interfaces/task.interface";
import { ISection } from "../../interfaces/section.interface";
import { TasksService } from "../../services/tasks.service";
import { TaskEditorComponent, eTaskMode } from "../taskEditor/taskEditorComponent";
import { TaskListItemComponents } from "../taskListItem/taskListItem";
import { SectionsService } from '../../services/section.service';
import { SectionComponent , eSectionMode } from './sectionComponent/sectionComponent';

import '../InboxTaskListComponent/InboxTaskListComponent.scss';
const taskListTemplate = require('../InboxTaskListComponent/InboxTaskListComponent.hbs');

export class InboxTaskListComponent {
    private tasksService:TasksService = TasksService.Instance;
    private sectionsService:SectionsService = SectionsService.Instance;
    private taskList: ITask[] = [];
    private sectionList:ISection[] = [];
    private $el:any;

    constructor(taskList:ITask[]){
      this.taskList = taskList;
      this.sectionList = this.sectionsService.getSectionList();
      this.setHtml();

      this.tasksService.eventEmitter.on('task-change', () => {
        this.taskList = this.tasksService.getTasks()
        this.renderAllTasks(false);
        this.isTaskListEmpty();
      });

      this.tasksService.eventEmitter.on("addNewSubTask" , (newSubTask:ITask, subTask:ITask) => {
        this.renderAllTasks(false);
        this.isTaskListEmpty();
      })
      
      this.tasksService.eventEmitter.on("toggle-completed-tasks" , (completedTasksList) => {
        this.renderCompletedTasks(completedTasksList);
        this.isTaskListEmpty();
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
      this.renderAllTasks(false);
      this.isTaskListEmpty();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".item.show-completed-tasks").on("click" , (e) => {
        this.onItemShowCompletedTasksClick(e);
      })
      this.$el.find(".item.hide-completed-tasks").on("click" , (e) => {
        this.onItemHideCompletedTasksClick(e);
      })
      this.$el.find(".settings-btn").on("click" , (e) => {
      this.onSettingsBtnClick(e);
      })
    }

    //----------------------------------
    // onItemShowCompletedTasksClick
    //----------------------------------

    onItemShowCompletedTasksClick(e){
      this.renderAllTasks(true);
      this.$el.find(".show-completed-tasks").addClass("hide");
      this.$el.find(".hide-completed-tasks").removeClass("hide");
      this.$el.find(".settings-menu").addClass("hide");
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
    // onSettingsBtnClick
    //----------------------------------

    onSettingsBtnClick(e){
      this.$el.find(".settings-menu").toggleClass("hide");
    }

    //----------------------------------
    // renderAllTasks
    //----------------------------------

    renderAllTasks(showComplete:boolean){    
      this.$el.find(".inbox-task-list-body").html("");

      new SectionComponent(null , this , eSectionMode.taskList , showComplete);
      this.sectionList.forEach((section:ISection) => {
        new SectionComponent(section , this ,  eSectionMode.section,showComplete);
      })
    }

    //----------------------------------
    // renderAllTasks
    //----------------------------------

    renderCompletedTasks(completedTasksList){
      this.$el.find(".inbox-task-list-body").html("");

      new SectionComponent(null , this , eSectionMode.taskList , false);

      completedTasksList.forEach((task:ITask) => {
        let section = this.sectionsService.getSection(task.sectionId);
        new SectionComponent(section , this ,  eSectionMode.section , false);
      })
    }

    //----------------------------------
    // isTaskListEmpty
    //----------------------------------

    isTaskListEmpty(){
      debugger;
      if(this.tasksService.getNotFinishedTasks().length === 0){
        if(this.sectionList.length === 0){
          $(".empty-state-wrap").removeClass("hide");
        }
      }else {
        $(".empty-state-wrap").addClass("hide");
      }
    }
}