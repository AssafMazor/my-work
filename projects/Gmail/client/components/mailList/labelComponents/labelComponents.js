import {createNewLableComponents} from "./createNewLabelComponents/createNewLabelComponents.js"

export class labelComponents {
  tempalte;
  labelList;
  labelChoosed = []

  constructor(labelList) {
    this.labelList = labelList
    this.setHtml();
  }

  setHtml() {
    $.get("./components/mailList/labelComponents/labelComponents.hbs", (result) => {
      this.template = Handlebars.compile(result);
      $(".label-dialog").html(this.template(this.labelList));

      this.initEvents();
    });
  }

  initEvents(){
    $(".close-btn").on("click" , (e) => {
      this.onCloseBtnClick(e)
    })
    $(".create-new-lable .text").on("click" , (e) => {
      this.onCreateNewLabelClick(e)
    })
    $(".lables-list .item").on("click" , (e) => {
      this.onSquareBtnClick(e);
    })
    $(".apply-wrap").on("click" , (e) => {
      this.onApplyBtnClick(e);
    })
  }

  //----------------------------------
  // onCloseBtnClick
  //----------------------------------

  onCloseBtnClick(e){
    $(".label-dialog").addClass("hide");
  }

  //----------------------------------
  // onCloseBtnClick
  //----------------------------------

  onCreateNewLabelClick(){
    $(".create-new-label-dialog").addClass("show");
    new createNewLableComponents(this.labelList.length);
    $(".label-dialog").addClass("hide");
    $(".bg-shadow").removeClass("hide")
  }

  //----------------------------------
  // onSquareBtnClick
  //----------------------------------

  onSquareBtnClick(e){
    var closestItem = $(e.target).closest(".item")
    $(closestItem).toggleClass("checked");

    if($(e.target).closest(".item").hasClass("checked")){
      $(".apply-wrap").removeClass("hide")
      this.labelChoosed.push($(closestItem).data("id"));

    }else {
      this.labelChoosed = this.labelChoosed.filter((itemId) => {
        return itemId !== $(e.target).closest(".item").data("id");
      });
    }
    if(!$(".lables-list .item").hasClass("checked")){
      $(".apply-wrap").addClass("hide")
    }
  }

  //----------------------------------
  // onApplyBtnClick
  //----------------------------------

  onApplyBtnClick(e){
    $(".label-dialog").addClass("hide");
    app.dataService.addMailLabel(this.labelChoosed)
  }
}
