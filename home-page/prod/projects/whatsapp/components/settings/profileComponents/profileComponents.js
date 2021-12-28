import {changeNewProfilePicComponent} from './changeNewProfilePicComponent/changeNewProfilePicComponent.js';

export class profileComponent {

  
    constructor() {
      this.setHtml();
    }
  
    setHtml() {
      $.get("./components/settings/profileComponents/profileComponents.hbs",(result) => {
            this.template = Handlebars.compile(result);
            $(".profile-menu").html(this.template());  

            this.initEvents();
        }
      );
    }

    initEvents(){
      $(".profile-menu .exit-btn").on("click" , (e) => {
        this.onExitBtnCLick(e)
      })
      $(".change-name-row .name").on("keyup" , (e) => {
        this.onInputNameKeyup(e)
      })  
      $(".change-name-row .check").on("click" , (e) => {
        this.onNameCheckBtnClick(e)
      })  
      $(".change-title-row .title").on("keyup" , (e) => {
        this.onTitleInputKeyup(e)
      })  
      $(".change-title-row .check").on("click" , (e) => {
        this.onTitleCheckClick(e)
      })  
      $(".input-file").on("change" , (e) => {
        this.onInputChanged(e);
      })
      $(".change-profile-logo").on("click" , (e) => {
        this.onChangeProfileLogoClick(e);
      })
    }

      
  //----------------------------------
  // onExitBtnCLick
  //----------------------------------

  onExitBtnCLick(e){
    $(".profile-menu").removeClass("show")
  }

  //----------------------------------
  // onInputNameKeyup
  //----------------------------------

  onInputNameKeyup(e){
    if (e.which === 13) {
      if( $(".change-name-row .name").val() === ""){
        alert("need input content")
      }else {
        $(".profile .info-wrap .name").html($(".change-name-row .name").val());
        $(".change-name-row .name").val($(".change-name-row .name").val());
      }
    }
  }

  //----------------------------------
  // onCheckBtnClick
  //----------------------------------

  onNameCheckBtnClick(e){
    if( $(".change-name-row .name").val() === ""){
      alert("need input content")
    }else {
      $(".profile .info-wrap .name").html($(".change-name-row .name").val());
      $(".change-name-row .name").val($(".change-name-row .name").val());  
    }
  }

  //----------------------------------
  // onTitleInputKeyup
  //----------------------------------

  onTitleInputKeyup(e){
    if (e.which === 13) {
      if( $(".change-title-row .title").val() === ""){
        alert("need input content")
      }else {
        $(".profile .info-wrap .title").html($(".change-title-row .title").val());
        $(".change-title-row .title").val($(".change-title-row .title").val());
      }
    }
  }

  //----------------------------------
  // onTitleCheckClick
  //----------------------------------

  onTitleCheckClick(e){
    if( $(".change-title-row .title").val() === ""){
      alert("need input content")
    }else {
      $(".profile .info-wrap .title").html($(".change-title-row .title").val());
      $(".change-title-row .title").val($(".change-title-row .title").val());
    }
  }

  //----------------------------------
  // onChangeProfileLogoClick
  //----------------------------------

  onChangeProfileLogoClick(e){
    $(".input-file").click();
  }

  //----------------------------------
  // onInputChanged
  //----------------------------------

  onInputChanged(e){
    $(".add-contact-block-dialog-wrap").removeClass("hide")

    let files = (e.target).files;
  
    if (files.length > 0) {
      let file = files[0];
      let reader = new FileReader();

      reader.onload = (event) => {
        let img = new Image;
        img.onload = () => {
          setTimeout(() => {
            new changeNewProfilePicComponent(event.target.result)
          }, 50)
        };
        img.src = reader.result;
      }

      reader.readAsDataURL(file);
    }
  }
}
  