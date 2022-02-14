import './style.scss';
import $, { data } from "jquery"
import { MainComponent } from './components/main/main-component';
import Backbone from "backbone";
import { UiManagerService } from "./services/uiManager.service";
import { DataService } from "./services/data.service"

const dataService:DataService = DataService.Instance
const uiManagerService:UiManagerService = UiManagerService.Instance;


var Router = Backbone.Router.extend ({
    routes: {
        "": "main",
    },
    main: function(){
        this.navigate("boards", {trigger: true});
    },
});
  
var router = new Router();

dataService.loadData(()=>{
    new MainComponent();
    Backbone.history.start();      
})

