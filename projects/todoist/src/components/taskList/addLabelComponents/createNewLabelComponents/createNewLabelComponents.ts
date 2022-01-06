import $ from 'jquery';
import { Itask } from "../../../../interfaces/task.interface";
import { ILabel } from "../../../../interfaces/label.interface";
import '../createNewLabelComponents/createNewLabelComponents.scss';
import { TasksService } from "../../../../services/tasks.service";
import { LabelsService } from "../../../../services/labels.service";
import { addLabelComponents } from "../../addLabelComponents/addLabelComponents"

const createNewLabelTemplate = require('../createNewLabelComponents/createNewLabelComponents.hbs');

export class createNewLableComponents {
    userId;
    tasksService;
    labelsService;
    labels;

    constructor(userId) {
      this.tasksService = TasksService.Instance;
      this.labelsService = LabelsService.Instance;
      this.userId = userId
      this.setHtml();
    }
  
    setHtml() {
      this.labels = this.labelsService.getLabels()
        $(".create-new-label-dialog").html(createNewLabelTemplate);

        this.initEvents();
    }

    initEvents(){
      $(".close-btn").on("click" , (e) => {
          this.onCloseBtnClick(e);
      })
      $(".create-btn").on("click" , (e) => {
        this.onCreateBtnClick(e);
      })
      $(".new-lable-input").on("input" , (e) => {
        this.onInputChange(e);
      })
    }

    //----------------------------------
    // onCreateBtnClick
    //----------------------------------

    onCreateBtnClick(e){
      this.labelsService.createNewLabel({
        "name":$(".new-lable-input").val(),
        "id":this.labels.length + 1
      });
      $(".bg-shadow-wrap").addClass("hide");
      $(".create-new-label-dialog").removeClass("show");
    }

    //----------------------------------
    // onCloseBtnClick
    //----------------------------------

    onCloseBtnClick(e){
      $(".create-new-label-dialog").removeClass("show");
      $(".bg-shadow-wrap").addClass("hide");
    }

    //----------------------------------
    // onInputChange
    //----------------------------------

    onInputChange(e){
      if($(".new-lable-input").val() !== ""){
        $(".bottom .create-btn").removeClass("disable")
      }else {
        $(".bottom .create-btn").addClass("disable")
      }
    }
}
  