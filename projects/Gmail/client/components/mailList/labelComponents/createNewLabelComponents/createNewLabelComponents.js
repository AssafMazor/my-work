
export class createNewLableComponents {
    tempalte;
    id;
  
    constructor(id) {
      this.id = id
      this.setHtml();
    }
  
    setHtml() {
      $.get("./components/mailList/labelComponents/createNewLabelComponents/createNewLabelComponents.hbs", (result) => {
        this.template = Handlebars.compile(result);
        $(".create-new-label-dialog").html(this.template);

        this.initEvents();
      });
    }

    initEvents(){
      $(".close-btn").on("click" , (e) => {
          $(".create-new-label-dialog").removeClass("show");
          $(".bg-shadow").addClass("hide");
      })
      $(".create-btn").on("click" , (e) => {
        this.onCreateBtnClick(e);
      })
    }

    //----------------------
    //  onCreateBtnClick  //
    //----------------------

    onCreateBtnClick(e){
      if($(".new-lable-input").val() === ""){
        $(".new-lable-input").css("border" , "2px solid red")
        $(".create-new-label-dialog .title").html("No name specified. Please try another name:")
      }else {
        if(app.labelsService.isLabelNameExist($(".new-lable-input").val()).length > 0){
          $(".new-lable-input").css("border" , "2px solid red");
          $(".create-new-label-dialog .title").html("The label name you have chosen already exists. Please try another name:");
        }else {
          app.labelsService.createNewLabel({
            "id":this.id + 1,
            "name": $(".new-lable-input").val()
          }
          )
        app.dataService.createNewLabel(this.id + 1);
        $(".create-new-label-dialog").removeClass("show");
        $(".bg-shadow").addClass("hide");
        }
      }
    }
}
  