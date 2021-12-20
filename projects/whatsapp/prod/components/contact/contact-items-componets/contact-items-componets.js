
export class contactItem {
    contact;
    template;

    constructor(contact, markVal) {
        this.contact = contact
        this.setHtml(markVal);

        app.dataService.onMessageChangeSubject.subscribe((data)=>{
            if(data.messages !== null){
                let itemrow = $(`.left .list .item[data-id="${data.id}"]`);
                $(itemrow).addClass("selected");
            }
        })
    }

    setHtml(markVal) {
        $.get("./components/contact/contact-items-componets/contact-items-componets.hbs", (result) => {
          this.template = Handlebars.compile(result);

          let sentTime = moment(this.contact.time); 
          this.contact.dateDiff = this.getTime(sentTime);

         let content = this.template(this.contact);

         if(markVal !== ""){
            content = content.replaceAll(markVal , `<div class='bold'> ${markVal} </div>`)
         }
          
          $(".left .list").append(content);

          this.initEvents();

        })
    }

    initEvents(){
        let itemrow = $(`.item[data-id="${this.contact.id}"]`);

        $(itemrow).on("click", (e) => {
            this.onItemClick(e , itemrow);
        });
    }

    //----------------------------------
    // setEvents
    //----------------------------------
    
    getTime(sentTime) {
        let now = moment();
        let diff = now.diff(sentTime, 'days');

        if(diff > 7){
            return this.contact.sentDateFormat = sentTime.format('l');
        }else {
            if(diff > 0){
                var mydate = sentTime;
                var weekDayName =  moment(mydate).format('dddd');
                return this.contact.dateDiff = weekDayName
            }else {
                return this.contact.dateDiff = sentTime.format('h:m');
            }
        }
    }

    //----------------------------------
    // setEvents
    //----------------------------------

    onItemClick(e , itemrow) {
        var itemId = $(e.target).closest(".item").data("id");
        app.dataService.getMessageList(itemId);

        $(".item").removeClass("selected");
        $(itemrow).addClass("selected");
        $(".contact-info").removeClass("show");
    }
}