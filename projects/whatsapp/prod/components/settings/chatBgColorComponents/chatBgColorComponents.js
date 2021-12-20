
export class chatBackgroundComponent {
    constructor() {
      this.setHtml();
    }
  
    setHtml() {
      $.get("./components/settings/chatBgColorComponents/chatBgColorComponents.hbs",(result) => {
            this.template = Handlebars.compile(result);
            $(".chat-Background").html(this.template());

            this.initEvents();
        }
      );  
    }
    
    initEvents(){ 
      $(".exit-btn").on("click", (e) => {
        this.onExitBtnClick(e);
      })
      $(".color.green").on("click" , (e) => {
        this.oncolorGreenClick(e);
      })
      $(".color.brown").on("click" , (e) => {
        this.onClolorBrownClick(e);
      })
      $(".color.normal").on("click" , (e) => {
        this.onColorNormalClick(e)
      })
      $(".square").on("click" , (e) => {
        this.onSquareBtnClick(e)
      })
    }

          
      //----------------------------------
      // onExitBtnClick
      //----------------------------------

      onExitBtnClick(e){
        $(".chat-Background").removeClass("show")
        $(".right").removeClass("hide");
        $(".message-wrap").addClass("hide");
      }

       //----------------------------------
      // oncolorGreenClick
      //----------------------------------
      
      oncolorGreenClick(e){
        $(".message-wrap-bg").css("background-color" , "#153418")
      }

       //----------------------------------
      // onClolorBrownClick
      //----------------------------------

      onClolorBrownClick(e){
        $(".message-wrap-bg").css("background-color" , "rgba(33,42,92,1)")  
      }
       //----------------------------------
      // onColorNormalClick
      //----------------------------------

      onColorNormalClick(e){
        $(".message-wrap-bg").css("background-color" , "#0D1418")
      }
       //----------------------------------
      // onSquareBtnClick
      //----------------------------------

      onSquareBtnClick(e){
        $(".check-mark").toggleClass("hide");
        $(".square").toggleClass("check-bg");
        $(".message-list").toggleClass("hide-bg");
      }
}
  