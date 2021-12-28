
export class chooseThemeComponent {

    constructor() {
      this.setHtml();
    }
  
    setHtml() {
      $.get("./components/settings/chooseThemeComponent/chooseThemeComponent.hbs",(result) => {
            this.template = Handlebars.compile(result);
            $(".choose-theme-dialog").html(this.template());

            this.initEvents();

            let isWhite = window.localStorage.getItem('theme') === "white"

            if(isWhite){
                $(".circle-btn.white").prop("checked", true);
            }else {
                $(".circle-btn.dark ").prop("checked", true);

            }
        }
      );  
    }  

    initEvents(){
        $(".exit-btn").on("click" , (e) => {
            $(".choose-theme-dialog").removeClass("show")
        })
        $(".bottom .accept-wrap").on("click" , (e) => {
            if($('.circle-btn.white').is(':checked')){
                window.localStorage.setItem('theme', "white");
                location.reload();
            }else {
                window.localStorage.setItem('theme', "dark");
                location.reload();
            }
        })
    }
}