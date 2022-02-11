import './style.scss';
import $ from "jquery"
import { MainComponent } from './components/main/main-component';
import Backbone from "backbone";
import { UiManagerService } from "./services/uiManager.service";
import { DataService } from "./services/data.service"

const dataService:DataService = DataService.Instance
const uiManagerService:UiManagerService = UiManagerService.Instance;

const before = (router, cb)=>{
    let isLoggin = window.localStorage.getItem('isLoggin') === "true"
   if(!isLoggin){
      router.navigate("login", {trigger: true});
      $(".loader").addClass("hide");
   } else{
     if(!dataService.isdataNotLoaded){
        dataService.loadData(() => {
          $(".loader").addClass("hide");
          new MainComponent();
          cb();
        })
     }else{
       cb();
     }
   }
}

var Router = Backbone.Router.extend ({
  routes: {
      "": "main",
     'inbox' : 'inbox',
     'signUp':"signUp",
     'login':'login',
     'today' : 'today',
     'upcoming' : 'upcoming',
     'filters-labels' : 'filtersLabels',
     'filters/:filterId' : 'fillter',
     'label/:name' : 'label',
     'task/view/:id':"view",
  },
  main: function(){
    before(this, ()=>{
      this.navigate("inbox", {trigger: true});
    })
  },
  inbox: function() {
    before(this, ()=>{
      uiManagerService.showInbox()
    })
  },
  today: function() {
    before(this, ()=>{
      uiManagerService.showToday()
    })
  },
  upcoming: function() {
    before(this, ()=>{
      uiManagerService.showUpcoming()
    })
  },
  filtersLabels: function() {
    before(this, ()=>{
      uiManagerService.showFillterAndLabels();
    })
  },
  label: function(labelName:string) {
    before(this, ()=>{
      uiManagerService.showLabelTasksList(labelName);
    })
  },
  view:function(taskId:string){
    before(this, ()=>{
      uiManagerService.showViewTask(taskId)
    })
  },
  signUp:function(){
    uiManagerService.showSignUpPage()
  },
  login:function(){
    uiManagerService.showLoginPage()
  },
});

var router = new Router();
Backbone.history.start();  
