import $ from 'jquery';
import { ITask } from "../../../../interfaces/task.interface";
import { ILabel } from "../../../../interfaces/label.interface";
import { TasksService } from "../../../../services/tasks.service";
import { LabelsService } from "../../../../services/labels.service";

export enum eTaskAction {
  Add,
  Edit
}

export interface ILabelParams {
  parent: any,
  task:ITask,
  labels: ILabel[],
  action: eTaskAction
}

import '../labelsComponent/labelsComponent.scss';
const addLabelTemplate = require('../labelsComponent/labelsComponent.hbs');

export class LabelComponents {
    tasksService:TasksService;
    labelsService:LabelsService;
    selectedLabels:number[] = [];
    labelsList:ILabel[];
    task:ITask;
    action:any;
    parent:any;

    constructor(params:ILabelParams){
      this.tasksService = TasksService.Instance;
      this.labelsService = LabelsService.Instance;

      this.task = params.task;
      this.parent = params.parent;
      this.action = params.action === eTaskAction.Add
      this.labelsList = params.labels

      this.setHtml();
    }

    setHtml(){
      this.adjustLabels()

      this.parent.$main.find(".label-dialog").html(addLabelTemplate({
        labelsList:this.labelsList,
        action:this.action
      }))

      this.initEvents();
    }

    //----------------------------------
    // adjustLabels
    //----------------------------------

    adjustLabels(){
      this.labelsList.forEach((label) => {    
          label.isAttache = this.task.labels.includes(label.id);

          if(this.task.labels.includes(label.id)){
            this.selectedLabels.push(label.id)
          }
      });
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
          this.selectedLabels.push($(closestItem).data("id"));
        }else {
          this.selectedLabels = this.selectedLabels.filter((itemId) => {
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
        this.selectedLabels.push($(closestItem).data("id"));
      }else {
        this.selectedLabels = this.selectedLabels.filter((itemId) => {
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
      this.task.labels = []
      console.log(this.task.labels)
      this.parent.onChooseLabels(this.selectedLabels , this.labelsList);
      this.parent.$main.find(".label-dialog").removeClass("show");
    }

    //----------------------------------
    // onCloseBtnClick
    //----------------------------------

    onCloseBtnClick(e){
      this.parent.$main.find(".label-dialog").removeClass("show")
    }

    //----------------------------------
    // onApplyBtnClick
    //----------------------------------

    onApplyBtnClick(e){
      this.parent.onChooseLabels(this.selectedLabels , this.labelsList);

      this.parent.$main.find(".label-dialog").removeClass("show");
    }
}