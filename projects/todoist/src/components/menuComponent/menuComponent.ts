import $ from 'jquery';
import { LabelsService } from "../../services/labels.service";
import { TasksService } from "../../services/tasks.service";
import { addProjectComponent } from "../main/addProjectComponent/addProjectComponent";
import { ILabel } from '../../interfaces/label.interface';

import '../menuComponent/menuComponent.scss';
const menuTemplate = require('../menuComponent/menuComponent.hbs');

export class MenuComponent {
    private labelsService:LabelsService = LabelsService.Instance;
    private labelsList:ILabel[] = [];
    private taskService = TasksService.Instance;
    private labelTaskLength:number[] = [];
    private $el:any;

    constructor(){
      this.labelsService.eventEmitter.on('label-change', (labels:ILabel[]) => {
        this.labelsList = labels
        this.setHtml()
      });
      this.setHtml()
    }
    
    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.labelsList = this.labelsService.getLabels()
      this.getLabelsTaskLength();

      this.$el = $(menuTemplate({
        labels:this.labelsList,
        todayTime:new Date().getDate(),
        labelTaskLength:this.labelTaskLength
      }));

      $(".main .menu").html(this.$el)

      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".add-labels").on("click" , (e) => {
        this.onAddLabelClick(e);
      })
      this.$el.find(".labels-list .item").on("click" , (e) => {
        this.onItemClick(e);
      })
      this.$el.find(".sysLabelItem").on("click" , (e) => {
        this.onSystemLabelItemClick(e);
      })
    }

    //----------------------------------
    // onSystemLabelItemClick
    //----------------------------------

    onSystemLabelItemClick(e){
      this.$el.find(".sysLabelItem").removeClass("selected");
      $(e.target).closest(".sysLabelItem").addClass("selected");
    }

    //----------------------------------
    // onAddLabelClick
    //----------------------------------

    onAddLabelClick(e){
      new addProjectComponent();
      $(".bg-shadow-wrap").removeClass("hide");
      $(".project-dialog").addClass("show");
    }

    //----------------------------------
    // onItemClick
    //----------------------------------

    onItemClick(e){
      let LabelId = $(e.target).closest(".labels-list .item").data("id");
      this.taskService.getTaskLabels(LabelId)
    }

    //----------------------------------
    // getLabelsTaskLength
    //----------------------------------

    getLabelsTaskLength(){
      this.labelsList.forEach((label:ILabel) => {
        this.labelTaskLength = [];
        this.labelTaskLength.push(this.taskService.getLabelTaskLength(label.id))
      })
    }
}