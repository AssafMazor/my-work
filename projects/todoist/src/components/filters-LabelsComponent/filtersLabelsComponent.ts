import $ from 'jquery';
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from '../../services/labels.service';
import { ILabel } from '../../interfaces/label.interface';
import { addLabelComponent , elabelMode } from '../main/addLabelComponent/addLabelComponent';
import { LabelFilterItemComponent , eItemMode } from './labelFilterItemComponent/labelFilterItemComponent';

import '../filters-LabelsComponent/filtersLabelsComponent.scss';
const filterLabelTemplate = require('../filters-LabelsComponent/filtersLabelsComponent.hbs');

export class FiltersLabelsComponent {
    private tasksService:TasksService = TasksService.Instance;
    private labelsService:LabelsService = LabelsService.Instance;
    private $el:any;
    private labelList:ILabel[];

    constructor(){
      this.labelList = this.labelsService.getLabels();
      this.setHtml();

      this.labelsService.eventEmitter.on('label-change', (labelsList:ILabel[]) => {
        this.labelList = labelsList
        this.renderLabelList()
      });
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(filterLabelTemplate({
        labelList:this.labelList
      }))
      $(".main .container .task-list .inside-task-list").html(this.$el);

      this.initEvents();
      this.renderLabelList();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".add-label-btn").on("click" , (e) => {
        this.onAddLabelBtnClick(e);
      })
    }

    //----------------------------------
    // onAddLabelBtnClick
    //----------------------------------

    onAddLabelBtnClick(e){
      new addLabelComponent(elabelMode.add);
      $(".bg-shadow-wrap").removeClass("hide");
      $(".add-label-dialog").addClass("show");
    }

    //----------------------------------
    // renderLabelList
    //----------------------------------

    renderLabelList(){
      this.$el.find(".labels-list").html("")
      this.labelList.forEach((label) => {
        new LabelFilterItemComponent(label,this,this.$el.find(".labels-list"),eItemMode.label)
      })
    }
}