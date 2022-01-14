import $ from 'jquery';
import { isEmpty } from 'lodash';
import { ITask } from "../../../../interfaces/task.interface";
import { ILabel } from "../../../../interfaces/label.interface";
import { LabelsService } from "../../../../services/labels.service";
import { LabelsListComponents } from "./labelsListItemComponents/labelsListItemComponents";

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
    private labelsService:LabelsService  = LabelsService.Instance;
    private selectedLabels:number[] = [];
    private labelsList:ILabel[];
    private originallabelsList:ILabel[];
    private task:ITask;
    private action:any;
    private parent:any;
    private $el:any;

    constructor(params:ILabelParams){
      this.task = params.task;
      this.parent = params.parent;
      this.action = params.action === eTaskAction.Edit
      this.labelsList = params.labels
      this.originallabelsList = params.labels

      this.onLabelsChange();
      this.setHtml();
    }

    //----------------------------------
    // adjustLabels
    //----------------------------------

    setHtml(){
      this.adjustLabels()

      this.$el = $(addLabelTemplate({
        labelsList:this.labelsList,
        action:this.action
      }));
      this.parent.$el.find(".label-dialog").html(this.$el)
      this.labelsListPosition();
      this.setLabelsItem();
      this.initEvents();
    }

    //----------------------------------
    // labelsListPosition
    //----------------------------------

    labelsListPosition(){
      let top:number;
      let left:number;
      let bottom:number;
      let offset = this.parent.$el.find(".label-dialog").offset();
      let labelBtnHeigth = this.parent.$el.find(".label-dialog").height();
      let pageHeigth =  window.innerHeight;
      let labelsListHeigth = this.parent.$el.find(".label-contant").height();
      
      if(pageHeigth - (offset.top + labelsListHeigth) > 0){
        top =  offset.top + labelBtnHeigth;
        left = offset.left - 100;
        this.parent.$el.find(".label-contant").css('top' , top)
      }else {
        bottom =  pageHeigth - offset.top;
        left =  offset.left - 100;
        this.parent.$el.find(".label-contant").css('bottom' , bottom)
      }
      this.parent.$el.find(".label-contant").css('left' , left)
    }

    //----------------------------------
    // onLabelsChange
    //----------------------------------

    onLabelsChange(){
      this.labelsService.eventEmitter.on('label-change', (labelsList:ILabel[]) => {
        this.labelsList = labelsList;
        this.setLabelsItem();
      });
    }

    //----------------------------------
    // setLabelsItem
    //----------------------------------

    setLabelsItem(){
      $(".label-dialog .labels-list").html("")
      this.labelsList.forEach((label:ILabel) => {
        new LabelsListComponents(label , this)
      })
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
      $(".add-wrap").on("click" , (e) => {
        this.onAddBtnClick(e);
      })
      $(".add-new-label-header .label-header-input-text").on("input" , (e) => {
        this.onLabelInput(e);
      })
      $(".add-new-label-text").on("click" ,(e) => {
        this.onAddNewLabelClick(e);
      })
      $(".popper-overlay").on("click" , (e) => {
        this.onPopperClick(e)
      })
    }

    //----------------------------------
    // onPopperClick
    //----------------------------------

    onPopperClick(e){
      if(isEmpty($(e.target).closest(".label-contant"))){
        this.parent.onChooseLabels(this.selectedLabels , this.labelsList);

        this.parent.$el.find(".label-contant").addClass("hide");
        this.$el.addClass("hide")
      }
    }
    //----------------------------------
    // onAddTaskLabelItemClick
    //----------------------------------

    onAddNewLabelClick(e){
      let labelVal = this.$el.find(".label-header-input-text").val()
      this.labelsService.createNewLabel({
        "name":labelVal,
        "id":this.labelsService.getLabels().length + 1
      })
      this.parent.$el.find(".label-contant").removeClass("show");
    }

    //----------------------------------
    // onAddTaskLabelItemClick
    //----------------------------------

    onLabelInput(e){
      let labelVal =  this.$el.find(".label-header-input-text").val();

      this.labelsList = this.originallabelsList.filter((label) => {
        return label.name.includes(labelVal);
      });

      this.setLabelsItem()

      if(this.$el.find(".label-header-input-text").val() !== ""){
        if(isEmpty(this.labelsService.isLabelExist(labelVal))){
          this.$el.find(".inside-label-items-empty-error").removeClass("hide");
          (<any>this.$el.find(".input-label-name")).html(labelVal);
        }else {
          this.$el.find(".inside-label-items-empty-error").addClass("hide");
        }
      }else {
        this.$el.find(".inside-label-items-empty-error").addClass("hide");
      }
    }

    //----------------------------------
    // onAddBtnClick
    //----------------------------------

    onAddBtnClick(e){
      this.task.labels = []
      this.parent.onChooseLabels(this.selectedLabels , this.labelsList);
      this.parent.$el.find("label-contant").removeClass("show");
    }

    //----------------------------------
    // toggleClick
    //----------------------------------

    toggleClick(id , $el){
      if($el.find(".square").hasClass("checked")){
        this.selectedLabels.push(id);
      }else {
        this.selectedLabels = this.selectedLabels.filter((itemId) => {
          return itemId !== $el.data("id");
        });
      } 
    }
}