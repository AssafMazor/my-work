import $ from 'jquery';
import { Itask } from "../../../interfaces/task.interface";
import { ILabel } from "../../../interfaces/label.interface";
import '../addLabelComponents/addLabelComponents.scss';
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from "../../../services/labels.service";
import { createNewLableComponents } from "../addLabelComponents/createNewLabelComponents/createNewLabelComponents";


export interface ILabelParams {
  parent: any,
  task: {},
  labels: ILabel[],
  caller: string
}

const addLabelTemplate = require('../addLabelComponents/addLabelComponents.hbs');

export class addLabelComponents {
    tasksService:TasksService;
    labelsService:LabelsService;
    labelChoosed:number[] = [];
    labelsList;
    task;
    caller;
    parent;

    constructor(params:ILabelParams){
      this.tasksService = TasksService.Instance;
      this.labelsService = LabelsService.Instance;

      this.task = params.task;
      this.parent = params.parent;
      this.caller = params.caller === "addTask"
      this.labelsList = params.labels

      this.setHtml();
    }

    setHtml(){
      this.isTasksHaveLabel()
      
      console.log(this.labelsList)

      this.parent.$main.find(".label-dialog").html(addLabelTemplate({
        labelsList:this.labelsList,
        caller:this.caller
      }))

      this.initEvents();
    }

    //----------------------------------
    // isTasksHaveLabel
    //----------------------------------

    isTasksHaveLabel(){
      this.labelsList.forEach((label) => {       
        label.isTaskHaveLabel = this.task.labels.includes(label.id) ? true : false
        this.labelChoosed.push(this.task.labels.includes(label.id) && label.id) 
      })
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      $(".labels-list .add-task-label-item").on("click" , (e) => {
          this.onAddTaskLabelItemClick(e);
      })
      $(".close-btn").on("click" , (e) => {
        this.onCloseBtnClick(e);
      })
      $(".add-new-label-footer .text").on("click" , (e) => {
        this.onCreateNewLabelClick(e);
      })
      $(".apply-wrap").on("click" , (e) => {
        this.onApplyBtnClick(e);
      })
      $(".add-wrap").on("click" , (e) => {
        this.onAddBtnClick(e);
      })
      $(".add-task-new-label-item").on("click" , (e) => {
        this.onAddNewTaskLabelItemClick(e);
      })
    }

    //----------------------------------
    // onAddTaskLabelItemClick
    //----------------------------------

    onAddTaskLabelItemClick(e){
        var closestItem = $(e.target).closest(".add-task-label-item")
        $(closestItem).toggleClass("checked");
    
        if($(e.target).closest(".add-task-label-item").hasClass("checked")){
          $(".apply-wrap").removeClass("hide")
          this.labelChoosed.push($(closestItem).data("id"));
        }else {
          this.labelChoosed = this.labelChoosed.filter((itemId) => {
            return itemId !== $(e.target).closest(".add-task-label-item").data("id");
          });
        } 
        if(!$(".labels-list .add-task-label-item").hasClass("checked")){
          $(".apply-wrap").addClass("hide");
        }
    }

    //----------------------------------
    // onAddNewTaskLabelItemClick
    //----------------------------------

    onAddNewTaskLabelItemClick(e){
      let closestItem = $(e.target).closest(".add-task-new-label-item")
      $(closestItem).toggleClass("checked");
  
      if($(e.target).closest(".add-task-new-label-item").hasClass("checked")){
        $(".add-wrap").removeClass("hide")
        this.labelChoosed.push($(closestItem).data("id"));
      }else {
        this.labelChoosed = this.labelChoosed.filter((itemId) => {
          return itemId !== $(e.target).closest(".add-task-new-label-item").data("id");
        });
      } 
      if(!$(".labels-list .add-task-new-label-item").hasClass("checked")){
        $(".add-wrap").addClass("hide");
      }
    }

    //----------------------------------
    // onAddBtnClick
    //----------------------------------

    onAddBtnClick(e){
      this.tasksService.getTask(this.task.id).labels = []

      this.parent.onChooseLabels(this.labelChoosed , this.labelsList);
      this.parent.$main.find(".label-dialog").removeClass("show");
    }

    //----------------------------------
    // onCloseBtnClick
    //----------------------------------

    onCloseBtnClick(e){
      this.parent.$main.find(".label-dialog").removeClass("show")
    }

    //----------------------------------
    // onCreateNewLabelClick
    //----------------------------------

    onCreateNewLabelClick(e){
      new createNewLableComponents(this.task.id);
     
      $(".bg-shadow-wrap").removeClass("hide");
      $(".edit-label-dialog").removeClass("show")
      $(".add-new-label").removeClass("show");
      $(".create-new-label-dialog").addClass("show");
    }

    //----------------------------------
    // onApplyBtnClick
    //----------------------------------

    onApplyBtnClick(e){
      alert(this.labelChoosed)
      this.parent.onChooseLabels(this.labelChoosed , this.labelsList);

      this.parent.$main.find(".label-dialog").removeClass("show");
    }
}