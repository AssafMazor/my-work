app = {};

$(document).ready(function (){
    app.dataService = new DataService();
    new UI_Header();
    new UI_List();
    new UI_Menu();
})