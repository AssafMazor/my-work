import { addContactItemComponent } from "../addContactItemComponents.js";

export class selectContactsGroupComponents {
  contact;
  x = [];

  constructor(contact) {
    this.contact = contact;
    this.setHtml();

    app.dataService.onDataChangeSubject.subscribe((contactsList) => {
      this.contact = contactsList;
      this.setHtml();
    });
  }

  setHtml() {
    $.get(
      "./components/contact/selectContactsGroupComponents/selectContactsGroupComponents.hbs",
      (result) => {
        this.template = Handlebars.compile(result);
        $(".select-contacts").html(this.template({ contacts: this.contact }));

        this.initEvents();
      }
    );
  }

  initEvents() {
    $(".item").on("click", (e) => {
      this.onItemClick(e);
    });
    $(".accept-group-bg").on("click", (e) => {
      this.onAcceptGroupBgClick(e);
    });
    $(".select-contacts  .exit-btn").on("click", (e) => {
      this.onExitBtnClick(e);
    });
  }

  //----------------------------------
  // onItemClick
  //----------------------------------

  onItemClick(e) {
    if ($(e.target).closest(".item").hasClass("selected")) {
      $(e.target).closest(".item").removeClass("selected");
      $(e.target).closest(".item").find(".check-wrap").addClass("hide");

      this.x = this.x.filter((itemId) => {
        return itemId !== $(e.target).closest(".item").data("id");
      });
    } else {
      $(e.target).closest(".item").find(".check-wrap").removeClass("hide");
      $(".accept-group-bg").addClass("show");
      $(e.target).closest(".item").addClass("selected");
      this.x.push($(e.target).closest(".item").data("id"));
    }
    if (!$(".item").hasClass("selected")) {
      $(".accept-group-bg").removeClass("show");
    }
  }

  //----------------------------------
  // onAcceptGroupBgClick
  //----------------------------------

  onAcceptGroupBgClick(e) {
    $(".add-contact-item").addClass("show");

    new addContactItemComponent(this.x);
    $(".select-contacts").removeClass("show");
  }

  //----------------------------------
  // onExitBtnClick
  //----------------------------------

  onExitBtnClick(e) {
    $(".select-contacts").removeClass("show");
  }
}
