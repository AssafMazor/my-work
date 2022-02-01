import $ from 'jquery';
import { TasksService } from "../../../services/tasks.service";
import { LabelsService } from '../../../services/labels.service';
import { ILabel } from '../../../interfaces/label.interface';
import { addLabelComponent , elabelMode } from '../../main/addLabelComponent/addLabelComponent';
import { DeleteAlertComponent , edeleteMode } from '../../main/deleteAlertComponent/deleteAlertComponent';

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
      this.$el.find(".edit-item").on("click" , (e) => {
        this.onEditItemClick(e);
      })
      this.$el.find(".delete-item").on("click" , (e) => {
          this.onDeleteLabelItemClick(e);
      })
      this.$el.find(".add-favorite-item").on("click" , (e) => {
        this.onToggleFavoriteClick(e);
      })
      this.$el.find(".add-heart-btn").on("click" , (e) => {
        this.onToggleFavoriteClick(e);
      })
      this.$el.find(".remove-favorite-item").on("click" , (e) => {
        this.onToggleFavoriteClick(e);
      })
      this.$el.find(".remove-heart-btn").on("click" , (e) => {
        this.onToggleFavoriteClick(e);
      })
    }

    //----------------------------------
    // onEditLabelBtnClick
    //----------------------------------

    onEditLabelBtnClick(e){
      e.preventDefault();

      new addLabelComponent(elabelMode.edit,this.label);
      $(".bg-shadow-wrap").removeClass("hide");
      $(".add-label-dialog").addClass("show");
    }

    //----------------------------------
    // onDeleteLabelItemClick
    //----------------------------------

    onDeleteLabelItemClick(e){
      e.preventDefault();

      new DeleteAlertComponent(this.label.name,this.label.id,edeleteMode.label);
      $(".delete-dialog").removeClass("hide");
    }

    //----------------------------------
    // onEditLabelBtnClick
    //----------------------------------
    
    onEditItemClick(e){
      e.preventDefault();

      new addLabelComponent(elabelMode.edit,this.label);
      $(".bg-shadow-wrap").removeClass("hide");
      $(".add-label-dialog").addClass("show");
      $(".setting-dialog").addClass("hide");
    }

    //----------------------------------
    // onFavoriteItemClick
    //----------------------------------

    onToggleFavoriteClick(e){
      e.preventDefault();

      this.labelsService.toggleFavoriteLabel(this.label.id);
    }

    //----------------------------------
    // onSettingsBtnClick
    //----------------------------------

    onSettingsBtnClick(e){
      e.preventDefault();

      $(".setting-dialog").toggleClass("hide")
    }
}