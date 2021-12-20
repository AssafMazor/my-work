
export class MessageItemComponent {
    message;
    template;

    constructor(message) {
        this.message = message
        this.setHtml();
    }

    setHtml() {
        $.get("./components/messages/message-item-componets/message-item-componets.hbs", (result) => {
          this.template = Handlebars.compile(result);

          let sentTime = moment(this.message.datetime);

          this.message.sentTime = sentTime.format('l'); 


          this.message.isSender = this.message.type === 1
          $(".message-wrap-container").append(this.template(this.message));

        })
    }

}

