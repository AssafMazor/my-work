
export class searchMessageItem {
    message;
    
    constructor(message , markVal) {
        this.message = message
        this.setHtml(markVal);
    }
  
    setHtml(markVal) {
      $.get("./components/search/searchMessageItem/searchMessageItem.hbs",(result) => {
            this.template = Handlebars.compile(result);

            let sentTime = moment(this.message.datetime);
            this.message.sentTime = sentTime.format('l'); 

            let $msg = $('<div>').html(this.template(this.message));
            
            if(markVal !== ""){
              let replaced = this.message.content.replaceAll(markVal , `<div class='bold'> ${markVal} </div>`)
              $msg.find(".message-content").html(replaced)
            }

            $(".search-message-list").append($msg);
        }
      );
    }

}