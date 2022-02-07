import $ from 'jquery';
import { isEmpty } from 'lodash';
import { ITask } from "../../../interfaces/task.interface";
import { ILabel } from "../../../interfaces/label.interface";
import { LabelsService } from "../../../services/labels.service";
import { LabelsListComponent } from "./labelsListItem/labels-List-item-component";
import { CommonService , IPosition } from '../../../services/common.service';

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

import '../labels/labels-component.scss';
const addLabelTemplate = require('../labels/labels-component.hbs');

export class LabelComponent {
    private labelsService:LabelsService  = LabelsService.Instance;
    private commonService:CommonService = CommonService.Instance
    private selectedLabels:string[] = [];
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
      this.commonService.getPotions(
        this.parent.$el, <IPosition>{
          btnClass:".label-btn-wrap",
          dialogClass:".label-contant"
        } 
      );
      this.setLabelsItem();
      this.initEvents();
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
        new LabelsListComponent(label , this)
      })
    }

    //----------------------------------
    // adjustLabels
    //----------------------------------

    adjustLabels(){
      this.labelsList.forEach((label:ILabel) => {    
          label.data.isAttache = this.task.data.labels.includes(label.id);

          if(this.task.data.labels.includes(label.id)){
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
      let id = this.labelsService.getLabels().length + 1
      let labelVal = this.$el.find(".label-header-input-text").val()
      this.labelsService.createNewLabel({
        "id":id.toString(),
        "data":{
          "name":labelVal,
          "favorite":false,
          "isAttache":false
        }
      },
      ()=>{}
      )
      this.parent.$el.find(".label-contant").removeClass("show");
    }

    //----------------------------------
    // onAddTaskLabelItemClick
    //----------------------------------

    onLabelInput(e){
      let labelVal =  this.$el.find(".label-header-input-text").val();

      this.labelsList = this.originallabelsList.filter((label:ILabel) => {
        return label.data.name.includes(labelVal);
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
      this.task.data.labels = []
      this.parent.onChooseLabels(this.selectedLabels , this.labelsList);
      this.parent.$el.find("label-contant").removeClass("show");
    }

    //----------------------------------
    // toggleClick
    //----------------------------------

    toggleClick(id:string , $el:any){
      id = id.toString();
      if($el.find(".square").hasClass("checked")){
        this.selectedLabels.push(id);
      }else {
        this.selectedLabels = this.selectedLabels.filter((itemId:string) => {
          return itemId !== $el.data("id");
        });
      } 
    }
}