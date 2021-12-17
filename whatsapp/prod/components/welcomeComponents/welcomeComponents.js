
export class WelcomeComponent {

    constructor() {
        this.setHtml();
    }

    setHtml() {
        $.get("./components/welcomeComponents/welcomeComponents.hbs", (result) => {
          this.template = Handlebars.compile(result);
          $(".right").html(this.template);
        })
    }
}   