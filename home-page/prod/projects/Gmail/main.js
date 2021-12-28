import {UI_Header} from "./components/header/header.js"
import {UI_List} from "./components/mailList/list/list.js"
import {UI_Menu} from "./components/menu/menu.js"
import {DataService} from "./services/Data.Service.js"
import {LabelsService} from "../../services/label.service.js"



window.app = {};

$(document).ready(function (){
    app.dataService = new DataService();
    app.labelsService = new LabelsService();
    new UI_Header();
    new UI_List();
    new UI_Menu();
})