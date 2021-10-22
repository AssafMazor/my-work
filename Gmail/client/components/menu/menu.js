class UI_Menu {
  html;

  constructor() {
    this.setHtml();
    this.initEvents();
  }

  setHtml() {
    $.get("./components/menu/menu.html", (result) => {
      this.html = result;
      $(".menu-list").html(this.html);
      this.initEvents();
    });
  }

  initEvents() {
  }
}
