import './style.scss';
import $ from "jquery"
import { MainComponents } from './components/main/mainComponent';
import Backbone from "backbone";
import { UiManagerService } from "./services/uiManager.service";
import { DataService } from "./services/data.service"

const dataService:DataService = DataService.Instance
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
    uiManagerService.showInbox()
  },
  today: function() {
    uiManagerService.showToday()
  },
  upcoming: function() {
    uiManagerService.showUpcoming()
  },
  filtersLabels: function() {
    uiManagerService.showFillterAndLabels();
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

dataService.loadData(() => {
  $(".loader").addClass("hide");
  new MainComponents();
  Backbone.history.start();  
})
