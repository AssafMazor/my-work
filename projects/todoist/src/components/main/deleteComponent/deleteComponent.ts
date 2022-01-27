import $ from 'jquery';
import { isEmpty } from 'lodash';
import { ILabel } from '../../../interfaces/label.interface';
import { LabelsService } from '../../../services/labels.service';
import { TasksService } from '../../../services/tasks.service';

import "../deleteComponent/deleteComponent.scss"
const deleteTemplate = require('../deleteComponent/deleteComponent.hbs');

export class DeleteComponent {
  private $el:any;
  private tasksService:TasksService = TasksService.Instance;
  private labelsService:LabelsService = LabelsService.Instance;
  private label:ILabel;

  constructor(deletingName:string,label:ILabel){
    this.label = label
    this.setHtml(deletingName);
  }

  //----------------------------------
  // setHtml
  //----------------------------------

  setHtml(deletingName){
    this.$el = $(deleteTemplate({
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
  // onCloseBtnClick
  //----------------------------------

  onPopperOverlayClick(e){
    if(isEmpty($(e.target).closest(this.$el))){
      $(".delete-dialog").addClass("hide");
    }
  }
  
  //----------------------------------
  // onCloseBtnClick
  //----------------------------------

  onDeleteBtnClick(e){
    this.labelsService.deleteLabel(this.label);
    $(".delete-dialog").addClass("hide");
  }
}