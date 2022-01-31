import $ from 'jquery';
import { TasksService } from "../../services/tasks.service";
import { LabelsService } from '../../services/labels.service';
import { ILabel } from '../../interfaces/label.interface';
import { TaskListItemComponents } from '../taskListItem/taskListItem';
import { TaskEditorComponent , eTaskMode } from '../taskEditor/taskEditorComponent';
import { addLabelComponent , elabelMode } from '../main/addLabelComponent/addLabelComponent';
import { DeleteAlertComponent } from '../main/deleteAlertComponent/deleteAlertComponent';

import '../labelTasksListComponent/labelTasksListComponent.scss'
const labelTasksListTemplate = require('../labelTasksListComponent/labelTasksListComponent.hbs');

export class labelTasksListComponent {
    private tasksService:TasksService = TasksService.Instance;
    private labelsService:LabelsService = LabelsService.Instance;
    private $el:any;
    private label:ILabel;

    constructor(labelName:string){
      this.label = this.labelsService.getLabelByName(labelName);
      this.setHtml();

      this.tasksService.eventEmitter.on('task-change', () => {
        this.renderLabelTasks();
      });

      this.labelsService.eventEmitter.on('label-change', (labelsList:ILabel[]) => {
        this.setHtml();
      });
    }

    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
    this.$el = $(labelTasksListTemplate({
      label:this.label
    }))
    $(".main .container .task-list .inside-task-list").html(this.$el);

    this.initEvents();
    this.renderLabelTasks();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".add-task-wrap").on("click" , (e) => {
        this.onAddTaskClick(e);
      })
      this.$el.find(".label-title").on("click" , (e) => {
        this.onEditLabelNameClick(e);
      })
      this.$el.find(".cancel-btn").on("click",  (e) => {
        this.onCancelBtnClick(e);
      })
      this.$el.find(".save-btn-wrap").on("click" , (e) => {
        this.onSaveBtnClick(e);
      })
      this.$el.find(".label-name-input").on("input" , (e) => {
        this.onLabelNameChange(e);
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
      this.$el.find(".remove-favorite-item").on("click" , (e) => {
        this.onToggleFavoriteClick(e);
      })
      this.$el.find(".arrow-left-btn-wrap").on("click" , (e) => {
        this.onBackArrowBtnClick(e);
      })
      this.$el.find(".settings-wrap").on("click" , (e) => {
        this.onSettingsBtnClick(e);
      })
    }
    
    //----------------------------------
    // onBackArrowBtnClick
    //----------------------------------

    onSettingsBtnClick(e){
      this.$el.find(".setting-dialog").toggleClass("hide");
    }

    //----------------------------------
    // onBackArrowBtnClick
    //----------------------------------

    onBackArrowBtnClick(e){
      window.history.back()
    }

    //----------------------------------
    // onEditLabelBtnClick
    //----------------------------------

    onEditLabelBtnClick(e){
      new addLabelComponent(elabelMode.edit,this.label);
      $(".bg-shadow-wrap").removeClass("hide");
      $(".add-label-dialog").addClass("show");
    }

    //----------------------------------
    // onDeleteLabelItemClick
    //----------------------------------

    onDeleteLabelItemClick(e){
      new DeleteAlertComponent(this.label.name,this.label);
      $(".delete-dialog").removeClass("hide");
      this.$el.find(".setting-dialog").addClass("hide");
    }

    //----------------------------------
    // onEditLabelBtnClick
    //----------------------------------
    
    onEditItemClick(e){
      this.$el.find(".label-title").addClass("hide");
      this.$el.find(".edit-label-title-wrap").removeClass("hide");
      this.$el.find(".setting-dialog").addClass("hide");
    }

    //----------------------------------
    // onFavoriteItemClick
    //----------------------------------

    onToggleFavoriteClick(e){
      this.labelsService.toggleFavoriteLabel(this.label.id);
    }

    //----------------------------------
    // onEditLabelNameClick
    //----------------------------------

    onEditLabelNameClick(e){
      this.$el.find(".label-title").addClass("hide");
      this.$el.find(".edit-label-title-wrap").removeClass("hide")
    }

    //----------------------------------
    // onLabelNameChange
    //----------------------------------

    onLabelNameChange(e){
      if(this.$el.find(".label-name-input").val() === ""){ 
        this.$el.find(".save-btn-wrap").addClass("disable");
      }else {
        if(this.labelsService.getLabelByName(this.$el.find(".label-name-input").val()) === undefined){
          this.$el.find(".save-btn-wrap").removeClass("disable");
        }else {
          this.$el.find(".save-btn-wrap").addClass("disable");
        }
      }
    }

    //----------------------------------
    // onSaveBtnClick
    //----------------------------------

    onSaveBtnClick(e){
      if(!this.labelsService.getLabelByName(this.$el.find(".label-name-input").val())){
          this.labelsService.saveLabel(this.$el.find(".label-name-input").val(),this.label.id);
          this.$el.find(".label-title").removeClass("hide");
          this.$el.find(".edit-label-title-wrap").addClass("hide");
      }     
    }

    //----------------------------------
    // onCancelBtnClick
    //----------------------------------

    onCancelBtnClick(e){
      this.$el.find(".label-title").removeClass("hide");
      this.$el.find(".edit-label-title-wrap").addClass("hide")
    }

    //----------------------------------
    // onAddTaskClick
    //----------------------------------

    onAddTaskClick(e){
      let $wrap = $(".new-editor-wrap");
      $wrap.removeClass("hide");

      new TaskEditorComponent({
        $wrap:$wrap, 
        parent:this,
        task:this.tasksService.returnNewTask(),
        isAddMode:eTaskMode.Add,
        isAddSubTask:false,
        parentSectionId:"-1",
        labelId:[this.label.id]
      });

      this.$el.find(".add-task-dialog").removeClass("hide");
      this.$el.find(".task-list-footer .add-task-wrap").addClass("hide");
    }

    //----------------------------------
    // renderLabelTasks
    //----------------------------------

    renderLabelTasks(){
      this.$el.find(".label-task-list-body").html("");
      this.tasksService.getTasksByLabelId(this.label.id).forEach((task) => {
        new TaskListItemComponents({
          task:task,
          parent:this,
          $host:this.$el.find(".label-task-list-body"),
          level:0,
          isToday:true
        });
      })
    }
}