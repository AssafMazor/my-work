import $ from 'jquery';
import { isEmpty } from 'lodash';
import { ILabel } from '../../../interfaces/label.interface';
import { LabelsService } from '../../../services/labels.service';
import { TasksService } from '../../../services/tasks.service';

import "./deleteAlertComponent.scss"
const deleteAlertTemplate = require('../deleteAlertComponent/deleteAlertComponent.hbs');

export enum edeleteMode {
  task,
  label,
  view
}

export class DeleteAlertComponent {
  private $el:any;
  private tasksService:TasksService = TasksService.Instance;
  private labelsService:LabelsService = LabelsService.Instance;
  private deletingsId:string;
  private deletingType:boolean;
  private isViewMode:boolean;

  constructor(deletingName:string,deletingsId: string,deletingType:edeleteMode,isViewMode?:edeleteMode){
    this.deletingsId = deletingsId
    this.deletingType = deletingType === edeleteMode.task
    this.isViewMode = isViewMode === edeleteMode.view
    this.setHtml(deletingName);
  }

  //----------------------------------
  // setHtml
  //----------------------------------

  setHtml(deletingName){
    this.$el = $(deleteAlertTemplate({
        deletingName:deletingName
    }));
    $(".main .delete-dialog").html(this.$el);

    this.initEvents();
  }  

  //----------------------------------
  // initEvents
  //----------------------------------

  initEvents(){
    this.$el.find(".close-btn").on("click" , (e) => {
      this.onCloseBtnClick(e);
    })
    $(".delete-dialog").on("click" , (e) => {
      this.onPopperOverlayClick(e);
    })
    this.$el.find(".delete-btn").on("click" , (e) => {
      this.onDeleteBtnClick(e);
    })
  }

  //----------------------------------
  // onCloseBtnClick
  //----------------------------------

  onCloseBtnClick(e){
    $(".delete-dialog").addClass("hide");
  }

  //----------------------------------
  // onPopperOverlayClick
  //----------------------------------

  onPopperOverlayClick(e){
    if(isEmpty($(e.target).closest(this.$el))){
      $(".delete-dialog").addClass("hide");
    }
  }
  
  //----------------------------------
  // onDeleteBtnClick
  //----------------------------------

  onDeleteBtnClick(e){
    if(this.deletingType){
      this.tasksService.deleteTask(this.deletingsId,()=> {});
    }else {
      this.labelsService.deleteLabel(this.deletingsId, ()=>{});
    }
    if(this.isViewMode){
      $(".view-task-dialog").addClass("hide");
      window.history.back();
    }
    $(".delete-dialog").addClass("hide");
  }
}