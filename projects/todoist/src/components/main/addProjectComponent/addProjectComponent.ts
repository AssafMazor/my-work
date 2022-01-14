import $ from 'jquery';
import { LabelsService } from "../../../services/labels.service";
import { ILabel } from '../../../interfaces/label.interface';

import '../addProjectComponent/addProjectComponent.scss';
const addProjectTemplate = require('../addProjectComponent/addProjectComponent.hbs');

export class addProjectComponent {
    private labelsService:LabelsService  = LabelsService.Instance;
    private labelList:ILabel[];
    private $el:any;

    constructor(){
      this.labelList = this.labelsService.getLabels();
      this.setHtml();
    }

    setHtml(){
        this.$el = $(addProjectTemplate({}));
        $(".main .project-dialog").html(this.$el)

        this.initEvents();
    }

    initEvents(){
        $(".project-confirm .cancel").on("click" , (e) => {
            this.onCancelBtnClick(e);
        })
        $(".label-name-input").on("input" , (e) => {
            this.onLabelNameInput(e);
        })
        $(".project-confirm .add-project").on("click" , (e) => {
            this.onAddProjectClick(e);
        })
    }

    //----------------------------------
    // onCancelBtnClick
    //----------------------------------

    onCancelBtnClick(e){
        $(".project-dialog").removeClass("show")
    }

    //----------------------------------
    // onLabelNameInput
    //----------------------------------

    onLabelNameInput(e){
        if($(".label-name-input").val() !== ""){
            $(".project-confirm .add-project").removeClass("disable")
        }else {
            $(".project-confirm .add-project").addClass("disable")
        }
    }

    //----------------------------------
    // onAddProjectClick
    //----------------------------------

    onAddProjectClick(e){
        if(!$(".project-confirm .add-project").hasClass("disable")){
            this.labelsService.createNewLabel({
                "name":$(".label-name-input").val(),
                "id":this.labelList.length + 1
            })
            $(".project-dialog").removeClass("show");
            $(".bg-shadow-wrap").addClass("hide")
        }
    }
}