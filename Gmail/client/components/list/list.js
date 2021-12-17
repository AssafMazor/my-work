class UI_List {
  tempalte;
  data = {
    items: [],
  };

  constructor() {
    this.setHtml();
  }

  setHtml() {
    $.get("./components/list/list.hbs", (result) => {
      this.template = Handlebars.compile(result);
      $(".list").append(this.template);

      this.initEvents();

      app.dataService.onDataChangeQueueEvents.push((mailList) => {
        this.data.items = mailList;
        this.onDataChange();
      });

      app.dataService.onSelectedItemQueueEvent.push((arrayLength) => {
        this.onSelectedItemChange(arrayLength);
    });

      app.dataService.getMails();
    });
  }


  initEvents(){
    
    $(".primary-Type").on("click", (e) => {
      app.dataService.getMails(1);
      $(".category").removeClass("border")
      $(".primary-wrap").addClass("border")
    });

    $(".social-Type").on("click", (e) => {
      app.dataService.getMails(2);
      $(".category").removeClass("border")
      $(".social-wrap").addClass("border")
    });

    $(".promotions-Type").on("click", (e) => {
      app.dataService.getMails(3);
      $(".category").removeClass("border");
      $(".promotions-wrap").addClass("border");
    });

    $(".square").on("click", (e) => {
      this.onMainSelectClick();
    });

    $(".checkBoxTrash").on("click", (e) => {
      this.onDeletedClick(e);
    });

    $('.btn-important').on('clickout',  (e) => {
      $(".important-dialog").addClass("hide");
    });

    $(".ddl-mark-as-important").on("click", (e) => {
      this.onImportantClick(true);  
    });

    $('.btn-important').on('click',  (e) => {
      $(".important-dialog").removeClass("hide")
    });

    $(".ddl-mark-as-not-important").on("click", (e) => {
      this.onImportantClick(false);
    });
  }

  onDataChange() {
    this.renderList();
  }

  renderList() {
    $(".items-panle").html("")
      this.data.items.forEach((item)=>{
        new ListItem(item);
    })
  }

  onMainSelectClick(){  
    $(".square").removeClass("minus");
    $(".square").toggleClass("full");

    setTimeout(() => {
      if($(".square").hasClass("full")){
        this.data.items.forEach((item)=>{
          app.dataService.addSelectedItem(item.id);
          $(".item").addClass("checked");
          $(".checkBoxTrash").addClass("show");
          $(".btn-importantstar").addClass("show");
      })
      }else {
          $(".item").removeClass("checked");
          this.data.items.forEach((item)=>{
            app.dataService.removeSelectedItem(item.id);
        }) 
      }
    }, 0);
  }

  onSelectedItemChange(selectedLength){
    if(selectedLength > 0){

      
       if(selectedLength < this.data.items.length){ //minus
        $(".square").addClass("minus");
        $(".checkBoxTrash").addClass("show");
        $(".btn-important").addClass("show");
       }else {//full
        $(".square").addClass("full");
        $(".square").removeClass("minus")
       }

  }else {//empty
      $(".checkBoxTrash").removeClass("show");
      $(".square").removeClass("minus");
      $(".btn-important").removeClass("show");
    }
  }   

  onDeletedClick(){
    app.dataService.removeSelectedArray();
    $(".square").removeClass("minus");
    $(".square").removeClass("full");
    $(".btn-important").removeClass("show");
    $(".checkBoxTrash").removeClass("show");
  }

  onImportantClick(boolean){
    app.dataService.markSelectedAsImportant(boolean);
  }

}
