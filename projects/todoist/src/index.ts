import './style.scss';
import { MainComponents } from"./components/main/mainComponent";
import Backbone from "backbone";
import { TasksService } from './services/tasks.service';
import { UiManagerService } from "./services/uiManager.service";

const tasksService:TasksService = TasksService.Instance;
const uiManagerService:UiManagerService = UiManagerService.Instance;

var Router = Backbone.Router.extend ({
  routes: {
      "": "main",
     'inbox' : 'inbox',
     'today' : 'today',
     'upcoming' : 'upcoming',
     'filters-labels' : 'filtersLabels',
     'filters/:filterId' : 'fillter',
     'labels/:labelId' : 'label',
     'task/view/:id':"view"
  },

  main: function(){
      this.navigate("today", {trigger: true});
  },
  inbox: function() {
    uiManagerService.showInbox(tasksService.getTasks())
  },
  today: function() {
    uiManagerService.showToday(tasksService.getAllTasks())
  },
  upcoming: function() {
    uiManagerService.showUpcoming(tasksService.getAllTasks())
  },
  filtersLabels: function() {
      console.log("filtersLabels");
  },
  fillter: function(filterId) {
      console.log("fillter" + filterId);
  },
  label: function(labelId) {
      console.log("label" + labelId);
  },
  view:function(taskId){
    uiManagerService.showViewTask(taskId)
  }
});
var router = new Router();
new MainComponents();
Backbone.history.start();
