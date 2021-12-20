import {UI_Main} from './components/main/mainComponets/mainComponets.js';
import {DataService} from './services/Data.Service.js';

window.app = {};

$(document).ready(function (){
    app.dataService = new DataService();
    new UI_Main();
})
