import $ from 'jquery';
import '../menuComponent/menuComponent.scss';
import { LabelsService } from "../../../services/labels.service";
import { TasksService } from "../../../services/tasks.service";
import { addProjectComponent } from "../../main/addProjectComponent/addProjectComponent";
import { ILabel } from '../../../interfaces/label.interface';

const menuTemplate = require('../menuComponent/menuComponent.hbs');

export class MenuComponent {
    labelsService:LabelsService;
    labelsList;
    taskService;

    constructor(){
      this.labelsService = LabelsService.Instance;
      this.taskService = TasksService.Instance
      this.labelsService.eventEmitter.on('label-change', (labels:ILabel[]) => {
        this.labelsList = labels
        this.setHtml()
      });
      this.setHtml()
    }
    
    setHtml(){
      this.labelsList = this.labelsService.getLabels()
      this.getLabelsTaskLength();

      $(".main .menu").html(menuTemplate({
        labels:this.labelsList,
        todayTime:new Date().getDate()
      }))

      this.initEvents();
    }

    initEvents(){
      $(".add-labels").on("click" , (e) => {
        this.onAddLabelClick(e);
      })
      $(".labels-list .item").on("click" , (e) => {
        this.onItemClick(e);
      })
      $(".sysLabelItem").on("click" , (e) => {
        this.systemLabelClick(e);
      })
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
      this.labelsList.forEach((label) => {
        label.labelTaskLength = [];
        label.labelTaskLength.push(this.taskService.getLabelTaskLength(label.id))
      })
    }

    //----------------------------------
    // systemLabelClick
    //----------------------------------

    systemLabelClick(e){
      this.taskService.getTaskByCategory($(e.target).closest(".sysLabelItem").data("id"));
    }
}