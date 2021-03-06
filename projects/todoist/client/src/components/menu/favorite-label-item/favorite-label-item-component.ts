import $ from 'jquery';
import { LabelsService } from "../../../services/labels.service";
import { TasksService } from "../../../services/tasks.service";
import { ILabel } from '../../../interfaces/label.interface';

import '../favorite-label-item/favorite-label-item-component.scss';
const favoriteLabelItemTemplate = require('../favorite-label-item/favorite-label-item-component.hbs');

export class FavoriteLabelItemComponent {
    private labelsService:LabelsService = LabelsService.Instance;
    private label:ILabel;
    private taskService = TasksService.Instance;
    private $el:any;
    private parent:any;

    constructor(label:ILabel,parent:any){
        this.label = label;
        this.parent = parent
        this.setHtml();
    }
    
    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(favoriteLabelItemTemplate({
        label:this.label,
      }));

      this.parent.$el.find(".favorite-list").append(this.$el)

      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
    
    }
}