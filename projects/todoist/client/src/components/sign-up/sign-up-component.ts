import $ from 'jquery';
import '../sign-up/sign-up-component.scss';
const signUpTemplate = require('../sign-up/sign-up-component.hbs');

export class SignUpComponent {
    private $el:any;

    constructor(){
      this.setHtml();
    }
    
    //----------------------------------
    // setHtml
    //----------------------------------

    setHtml(){
      this.$el = $(signUpTemplate({}));

      $(".main").html(this.$el);

      this.initEvents();
    }

    //----------------------------------
    // initEvents
    //----------------------------------

    initEvents(){
      this.$el.find(".sign-up-button").on("click",(e)=>{
        this.onSignUpBtnClick(e);
      });
      this.$el.find(".email-input").on("input",(e)=>{
        this.onEmailInputChange(e);
      })
    }

    //----------------------------------
    // onSignUpBtnClick
    //----------------------------------

    onSignUpBtnClick(e){
      if(this.isMailCorrect() && this.$el.find(".password-input").val() !== ""){
        let newUser = {
          id:new Date().getTime().toString(),
          email:this.$el.find(".email-input").val(),
          password:this.$el.find(".password-input").val(),
        }
        $.ajax({
          type: "POST",
          url: 'http://localhost:3000/signup',
          data:{
            data:JSON.stringify(newUser),
          },
          success: (result) => {
            window.localStorage.setItem('userId',result.id);
            window.localStorage.setItem('isLoggin','true');
            window.location.replace('http://localhost:4000');
          },
          error: () => {
              return;
          }
        });
      }else {
        this.$el.find(".error-message").removeClass("hide")
      }
    }

    //----------------------------------
    // isMailCorrect
    //----------------------------------

    isMailCorrect(){
      const regex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

      if(!regex.test(this.$el.find(".email-input").val())){
          return false
      }
      return true
    }

    //----------------------------------
    // onEmailInputChange
    //----------------------------------

    onEmailInputChange(e){
      this.$el.find(".error-message").addClass("hide")
    }
}