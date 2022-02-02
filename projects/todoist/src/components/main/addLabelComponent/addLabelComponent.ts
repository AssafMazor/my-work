import $ from 'jquery';
import { LabelsService } from "../../../services/labels.service";
import { ILabel } from '../../../interfaces/label.interface';

import './addLabelComponent.scss';
const addLabelTemplate = require('./addLabelComponent.hbs');

export enum elabelMode {
    edit,
    add,
}

export class addLabelComponent {
    private labelsService:LabelsService  = LabelsService.Instance;
    private labelList:ILabel[];
    private $el:any;
    private isEditMode:boolean
    private label:ILabel | undefined;
    
    constructor(isEditMode:elabelMode,label?:ILabel){
      this.label = label || undefined
      this.labelList = this.labelsService.getLabels();
      this.isEditMode = isEditMode === elabelMode.edit;
      this.setHtml();
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
        this.$el = $(addLabelTemplate({
            isEditMode:this.isEditMode,
            label:this.label
        }));
        $(".main .add-label-dialog").html(this.$el)

        this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
        this.$el.find(".cancel").on("click" , (e) => {
            this.onCancelBtnClick(e);
        });
        this.$el.find(".label-name-input").on("input" , (e) => {
            this.onLabelNameInput(e);
        });
        this.$el.find(".add-label-btn").on("click" , (e) => {
            this.onAddLabelBtnClick(e);
        });
        this.$el.find(".save-label-btn").on("click" , (e) => {
            this.onSaveLabelBtnClick(e);
        })
    }

    //----------------------------------
    // onCancelBtnClick
    //----------------------------------

    onCancelBtnClick(e){
        $(".add-label-dialog").removeClass("show");
        $(".bg-shadow-wrap").addClass("hide");
    }

    //----------------------------------
    // onLabelNameInput
    //----------------------------------

    onLabelNameInput(e){
        if(this.$el.find(".label-name-input").val() !== ""){
            if(this.labelsService.isLabelExist(this.$el.find(".label-name-input").val()).length > 0){
                this.$el.find(".add-label-btn").addClass("disable");
                this.$el.find(".save-label-btn").addClass("disable");
                this.$el.find(".label-exsist-error").removeClass("hide");
            }else {
                this.$el.find(".add-label-btn").removeClass("disable");
                this.$el.find(".save-label-btn").removeClass("disable");
                this.$el.find(".label-exsist-error").addClass("hide");
            }
        }else {
            this.$el.find(".add-label-btn").addClass("disable");
            this.$el.find(".save-label-btn").addClass("disable");
        }
    }

    //----------------------------------
    // onAddProjectClick
    //----------------------------------

    onAddLabelBtnClick(e){
        let id = this.labelList.length + 1
        this.labelsService.createNewLabel({
            "name":(this.$el.find(".label-name-input").val() || '').toString(),
            "id":id.toString(),
            "favorite":false,
        },
        ()=>{}
        )
        $(".add-label-dialog").removeClass("show");
        $(".bg-shadow-wrap").addClass("hide")
    }
    
    //----------------------------------
    // onAddProjectClick
    //----------------------------------

    onSaveLabelBtnClick(e){
        if(this.label){
            this.labelsService.saveLabel(this.$el.find(".label-name-input").val(),this.label.id,()=>{});
            $(".add-label-dialog").removeClass("show");
            $(".bg-shadow-wrap").addClass("hide");
        }
    }
}