
export class UI_Menu {
  tempalte;
  labelList;

  constructor() {
    app.labelsService.onLabelChangeSubjectEvents.subscribe((labelList) => {
      this.labelList = labelList
      this.setHtml();
    });
  }

  setHtml() {
    $.get("./components/menu/menu.hbs", (result) => {
      this.template = Handlebars.compile(result);
      this.html = result;

      app.dataService.onDataChangeSubject.subscribe((mailList) => {
        this.getItemsLength(mailList);
      });

      $(".menu-list").html(this.template(this.labelList));
      this.initEvents();
    });
  }

  initEvents() {
    $(".bin-wrap").on("click", (e) => {
      app.dataService.getDeleted();
    });
    $(".inbox-wrap").on("click", (e) => {
      app.dataService.getMails(1);
    });
    $(".important-wrap").on("click", (e) => {
      app.dataService.getImportant();
    });
    $(".primary-menu").on("click", (e) => {
      this.onPrimaryMenuClick(e);
    });
    $(".social-menu").on("click", (e) => {
      this.onSocialMenuClick(e);
    });
    $(".promotions-menu").on("click", (e) => {
      this.onPromotionMenuClick(e);
    });
    $(".label").on("click" , (e) => {
      this.onLabelMenuClick(e);
    })
    $(".main-box").on("click" , (e) => {
      this.onMainBoxClick(e);
    })
  }

  getItemsLength(mailList){
    var mailListLength = mailList.length
    $(".inbox-wrap .num").html(mailListLength)
    if(mailListLength === 0){
      $(".inbox-wrap .num").html("")
    }
  }

  //----------------------------------
  // onPrimaryMenuClick
  //----------------------------------

  onPrimaryMenuClick(e){
    app.dataService.getMails(1);
    $(".category").removeClass("border")
    $(".primary-wrap").addClass("border")
  }

  //----------------------------------
  // onSocialMenuClick
  //----------------------------------

  onSocialMenuClick(e){
    app.dataService.getMails(2);
    $(".category").removeClass("border")
    $(".social-wrap").addClass("border")
  }

  //----------------------------------
  // onPromotionMenuClick
  //----------------------------------

  onPromotionMenuClick(e){
    app.dataService.getMails(3);
    $(".category").removeClass("border");
    $(".promotions-wrap").addClass("border");
  }

  //----------------------------------
  // onMainBoxClick
  //----------------------------------

  onMainBoxClick(e){
    $(".main-box").removeClass("selected")
    $(e.target).closest(".main-box").addClass("selected")
  }

  //----------------------------------
  // onLabelMenuClick
  //----------------------------------

  onLabelMenuClick(e){
    app.dataService.getMailsLabel($(e.target).closest(".label").data("id"));
  }
}
