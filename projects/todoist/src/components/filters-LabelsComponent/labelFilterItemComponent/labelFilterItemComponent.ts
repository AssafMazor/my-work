import $ from 'jquery';
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from '../../../services/labels.service';
import { ILabel } from '../../../interfaces/label.interface';
import { addLabelComponent , elabelMode } from '../../main/addLabelComponent/addLabelComponent';
import { DeleteComponent } from '../../main/deleteComponent/deleteComponent';

export enum eItemMode {
  label,
  filter,
}

import '../labelFilterItemComponent/labelFilterItemComponent.scss'
const labelFilterItemTemplate = require('../labelFilterItemComponent/labelFilterItemComponent.hbs');

export class LabelFilterItemComponent {
    private tasksService:TasksService = TasksService.Instance;
    private labelsService:LabelsService = LabelsService.Instance;
    private $el:any;
    private label:ILabel;
    private filterList;
    private parent:any;
    private $host:any;
    private isLabelMode:boolean;
    
    constructor(label:ILabel,parent:any,$host:any,isLabelMode:eItemMode){
      this.label = label;
      this.parent = parent
      this.$host = $host
      this.isLabelMode = isLabelMode === eItemMode.label
      this.setHtml();
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(labelFilterItemTemplate({
        label:this.label,
        isLabelMode:this.isLabelMode
      }))
      this.$host.append(this.$el);

      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".edit-btn").on("click" , (e) => {
        this.onEditLabelBtnClick(e);
      })
      this.$el.find(".more-settings-btn").on("click" , (e) => {
        this.onSettingsBtnClick(e);
      })
      this.$el.find(".item.edit-item").on("click" , (e) => {
        this.onEditItemClick(e);
      })
      this.$el.find(".delete-item").on("click" , (e) => {
          this.onDeleteLabelItemClick(e);
      })
    }

    //----------------------------------
    // onEditLabelBtnClick
    //----------------------------------

    onEditLabelBtnClick(e){
      new addLabelComponent(elabelMode.edit,this.label);
      $(".bg-shadow-wrap").removeClass("hide");
      $(".label-dialog").addClass("show");
    }

    //----------------------------------
    // onDeleteLabelItemClick
    //----------------------------------

    onDeleteLabelItemClick(e){
      new DeleteComponent(this.label.name,this.label);
      $(".delete-dialog").removeClass("hide");
    }

    //----------------------------------
    // onEditLabelBtnClick
    //----------------------------------
    
    onEditItemClick(e){
      new addLabelComponent(elabelMode.edit,this.label);
      $(".bg-shadow-wrap").removeClass("hide");
      $(".label-dialog").addClass("show");
      $(".setting-dialog").addClass("hide")
    }

    //----------------------------------
    // onSettingsBtnClick
    //----------------------------------

    onSettingsBtnClick(e){
      $(".setting-dialog").toggleClass("hide")
    }
}