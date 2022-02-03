import $ from 'jquery';
import { LabelsService } from "../../services/labels.service";
import { TasksService } from "../../services/tasks.service";
import { ILabel } from '../../interfaces/label.interface';
import { FavoriteLabelItemComponent } from './favorite-label-item/favorite-label-item-component';
import { isEmpty } from 'lodash';

import '../menu/menu-component.scss';
const menuTemplate = require('../menu/menu-component.hbs');

export class MenuComponent {
    private labelsService:LabelsService = LabelsService.Instance;
    private labelsList:ILabel[] = [];
    private taskService = TasksService.Instance;
    private labelTaskLength:number[] = [];
    private $el:any;

    constructor(){
      this.setHtml();

      this.labelsService.eventEmitter.on('label-change', (labelsList:ILabel[]) => {
        this.labelsList = labelsList
        this.renderFavoriteLabelList();
        this.isFavoriteLabelListEmpty();
      });
    }
    
    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.labelsList = this.labelsService.getLabels();
      this.getLabelsTaskLength();

      this.$el = $(menuTemplate({
        labels:this.labelsList,
        todayTime:new Date().getDate(),
        favoriteListLength:this.labelsService.getFavoriteLabels().length === 0,
      }));

      $(".main .menu").html(this.$el)

      this.initEvents();
      this.renderFavoriteLabelList()
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
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
    
    //----------------------------------
    // renderFavoriteLabelList
    //----------------------------------

    renderFavoriteLabelList(){
      this.$el.find(".favorite-list").html("")
      this.labelsService.getFavoriteLabels().forEach((label:ILabel) => {
        new FavoriteLabelItemComponent(label,this)
      })
    }

    //----------------------------------
    // isFavoriteLabelListEmpty
    //----------------------------------

    isFavoriteLabelListEmpty(){
      debugger;

      if(isEmpty(this.labelsService.getFavoriteLabels())){
        this.$el.find(".menu-item.favorite-wrap").addClass("hide");
      }else {
        this.$el.find(".menu-item.favorite-wrap").removeClass("hide");
      }
    }
}