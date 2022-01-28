import $ from 'jquery';
import { LabelsService } from "../../../services/labels.service";
import { ILabel } from '../../../interfaces/label.interface';

import '../addFilterComponents/addFilterComponents.scss';
const addLabelTemplate = require('../addFilterComponents/addFilterComponents.hbs');

export class AddFilterComponent {
    private labelsService:LabelsService  = LabelsService.Instance;
    private labelList:ILabel[];
    private $el:any;

    constructor(){
      this.labelList = this.labelsService.getLabels();
      this.setHtml();
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
        this.$el = $(addLabelTemplate({}));
        $(".main .add-filter-dialog").html(this.$el)

        this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        $(".filter-confirm .cancel").on("click" , (e) => {
            this.onCancelBtnClick(e);
        })
        $(".filter-name-input").on("input" , (e) => {
            this.onLabelNameInput(e);
        })
        $(".filter-confirm .add-filter").on("click" , (e) => {
            this.onAddProjectClick(e);
        })
    }

    //----------------------------------
    // onCancelBtnClick
    //----------------------------------

    onCancelBtnClick(e){
        $(".add-filter-dialog").removeClass("show")
    }

    //----------------------------------
    // onLabelNameInput
    //----------------------------------

    onLabelNameInput(e){
        if($(".filter-name-input").val() !== ""){
            $(".filter-confirm .add-filter").removeClass("disable")
        }else {
            $(".filter-confirm .add-filter").addClass("disable")
        }
    }

    //----------------------------------
    // onAddProjectClick
    //----------------------------------

    onAddProjectClick(e){
        this.labelsService.createNewLabel({
            "name":($(".filter-name-input").val() || '').toString(),
            "id":this.labelList.length + 1
        })
        $(".add-filter-dialog").removeClass("show");
        $(".bg-shadow-wrap").addClass("hide")
    }
}