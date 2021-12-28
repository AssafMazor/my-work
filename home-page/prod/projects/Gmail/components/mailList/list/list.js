import {ListItem} from "../list-item/list-item.js"
import {labelComponents} from ".././labelComponents/labelComponents.js"

export class UI_List {
  tempalte;
  data = {
    items: [],
  };
  labelList;

  constructor() {
    this.setHtml();
    
    app.labelsService.onLabelChangeSubjectEvents.subscribe((labelList) => {
      this.labelList = labelList
    });
  }

  setHtml() {
    $.get("./components/mailList/list/list.hbs", (result) => {
      this.template = Handlebars.compile(result);
      $(".list").append(this.template);

      this.initEvents();

      app.dataService.onDataChangeSubject.subscribe((mailList) => {
        this.data.items = mailList
        this.onDataChange();
      });

      app.dataService.onSelectedItemQueueEvent.subscribe((arrayLength) => {
        this.onSelectedItemChange(arrayLength);
    });

      app.dataService.getMails();
    });
  }


  initEvents(){
    $(".primary-Type").on("click", (e) => {
      this.onPrimaryClick(e);
    });
    $(".social-Type").on("click", (e) => {
      this.onSocialClick(e);
    });
    $(".promotions-Type").on("click", (e) => {
      this.PromotionClick(e);
    });
    $(".square").on("click", (e) => {
      this.onMainSelectClick();
    });
    $(".checkBoxTrash").on("click", (e) => {
      this.onDeletedClick(e);
    });
    $('.btn-important').on('clickout',  (e) => {
      this.onClickoutImportantDialog(e);
    });
    $(".ddl-mark-as-important").on("click", (e) => {
      this.onImportantClick(true);  
    });
    $('.btn-important').on('click',  (e) => {
      this.onClickoutImportantDialogClick(e);
    });
    $(".ddl-mark-as-not-important").on("click", (e) => {
      this.onImportantClick(false);
    });
    $(".label-btn").on("click" , (e) => {
      this.onLabelBtnClick(e)
    })
  }

  //----------------------------------
  // onPrimaryClick
  //----------------------------------

  onPrimaryClick(e){
    app.dataService.getMails(1);
    $(".category").removeClass("border")
    $(".primary-wrap").addClass("border")
  }

  //----------------------------------
  // onClickoutImportantDialogClick
  //----------------------------------

  onClickoutImportantDialogClick(e){
    $(".important-dialog").removeClass("hide")
  }

  //----------------------------------
  // onClickoutImportantDialog
  //----------------------------------

  onClickoutImportantDialog(e){
    $(".important-dialog").addClass("hide");
  }

  //----------------------------------
  // PromotionClick
  //----------------------------------

  PromotionClick(e){
    app.dataService.getMails(3);
    $(".category").removeClass("border");
    $(".promotions-wrap").addClass("border");
  }

  //----------------------------------
  // onSocialClick
  //----------------------------------

  onSocialClick(e){
    app.dataService.getMails(2);
    $(".category").removeClass("border")
    $(".social-wrap").addClass("border")
  }

  //----------------------------------
  // onDataChange
  //----------------------------------

  onDataChange() {
    this.renderList();
  }

  //----------------------------------
  // renderList
  //----------------------------------

  renderList() {
    $(".items-panle").html("")
      this.data.items.forEach((item)=>{
        new ListItem(item);
    })
  }

  //----------------------------------
  // onMainSelectClick
  //----------------------------------

  onMainSelectClick(){  
    $(".square").removeClass("minus");
    $(".square").toggleClass("full");

    setTimeout(() => {
      if($(".square").hasClass("full")){
        this.data.items.forEach((item)=>{
          app.dataService.addSelectedItem(item.id);
      })
        $(".item").addClass("checked");
        $(".checkBoxTrash").addClass("show");
        $(".btn-importantstar").addClass("show");
        $(".label-btn").removeClass("hide");
      }else {
          $(".item").removeClass("checked");
          this.data.items.forEach((item)=>{
            app.dataService.removeSelectedItem(item.id);
        }) 
      }
    }, 0);
  }

   //----------------------------------
  // onSelectedItemChange
  //----------------------------------

  onSelectedItemChange(selectedLength){
    if(selectedLength > 0){
       if(selectedLength < this.data.items.length){ //minus
        $(".square").addClass("minus");
        $(".checkBoxTrash").addClass("show");
        $(".label-btn").removeClass("hide");
        $(".btn-important").addClass("show");
       }else {//full
        $(".square").addClass("full");
        $(".square").removeClass("minus")
        $(".label-btn").removeClass("hide");
       }

  }else {//empty
      $(".checkBoxTrash").removeClass("show");
      $(".square").removeClass("minus");
      $(".btn-important").removeClass("show");
      $(".label-btn").addClass("hide");
    }
  }   

  //----------------------------------
  // onDeletedClick
  //----------------------------------

  onDeletedClick(){
    app.dataService.removeSelectedArray();
    $(".square").removeClass("minus");
    $(".square").removeClass("full");
    $(".btn-important").removeClass("show");
    $(".checkBoxTrash").removeClass("show");
    $(".label-btn").addClass("hide")
  }
 //----------------------------------
  // onImportantClick
  //----------------------------------

  onImportantClick(boolean){
    app.dataService.markSelectedAsImportant(boolean);
  }
 //----------------------------------
  // onLabelBtnClick
  //----------------------------------

  onLabelBtnClick(e){
    $(".label-dialog").removeClass("hide");
    app.labelsService.getLabels()
    new labelComponents(this.labelList)
  }
}
