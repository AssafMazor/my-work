import $ from 'jquery';
import { ILabel } from "../../../../interfaces/label.interface";

import './labelsListItemComponents.scss';
const labelsListTemplate = require('../labelsListItemComponents/labelsListItemComponents.hbs');

export class LabelsListComponents {
    private label:ILabel;
    private $el:any;
    private parent:any;

    constructor(label:ILabel , parent:any){
      this.label = label
      this.parent = parent
      this.setHtml();
    }

    setHtml(){
      this.$el = $(labelsListTemplate({
        label:this.label
      }));

      $(".label-dialog .labels-list").append(this.$el);
      this.initEvents();
    }

    initEvents(){
      this.$el.on("click" , (e) => {
        this.onLabelItemClick(e);
      })
    }

    //----------------------------------
    // onAddTaskLabelItemClick
    //----------------------------------

    onLabelItemClick(e){ 
      this.$el.find(".square").toggleClass("checked");
      this.parent.toggleClick(this.$el.data("id") , this.$el);
      
      if(!$(".labels-list .label-item .square").hasClass("checked")){
        $(".apply-wrap").addClass("hide");
      }
    }
}