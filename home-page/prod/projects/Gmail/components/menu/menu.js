class UI_Menu {
  html;

  constructor() {
    this.setHtml();
    this.initEvents();
  }

  setHtml() {
    $.get("./components/menu/menu.html", (result) => {
      this.html = result;

      app.dataService.onDataChangeQueueEvents.push((mailList) => {
        this.getItemsLength(mailList);
      });

      $(".menu-list").html(this.html);
      this.initEvents();
    });
  }

  initEvents() {
    $(".menu .main-box .info").on("click", (e) => {
      app.dataService.getDeleted(e);
    });
    $(".bin").on("click", (e) => {
      app.dataService.getDeleted(e);
    });
    $(".inbox-wrap").on("click", (e) => {
      app.dataService.getMails(1);
    });
    $(".important-wrap").on("click", (e) => {
      app.dataService.getImportant(e);
    });
    $(".primary-menu").on("click", (e) => {
      app.dataService.getMails(1);
      $(".category").removeClass("border")
      $(".primary-wrap").addClass("border")
    });
    $(".social-menu").on("click", (e) => {
      app.dataService.getMails(2);
      $(".category").removeClass("border")
      $(".social-wrap").addClass("border")
    });
    $(".promotions-menu").on("click", (e) => {
      app.dataService.getMails(3);
      $(".category").removeClass("border");
      $(".promotions-wrap").addClass("border");
    });
  }

  getItemsLength(mailList){
    var mailListLength = mailList.length
    $(".inbox-wrap .num").html(mailListLength)
    if(mailListLength === 0){
      $(".inbox-wrap .num").html("")
    }
  }
}
