export class changeNewProfilePicComponent {

    constructor(img) {
        this.setHtml(img); 
    }

    setHtml(img) {
        $.get("./components/settings/changeNewProfilePicComponent/changeNewProfilePicComponent.hbs", (result) => {
        this.template = Handlebars.compile(result);
          
        $(".change-new-profile-pic-wrap").html(this.template());

        this.initEvents()
        let croppie = this.setCroppieEditor(img);
        this.onResult(croppie);
        })
    }

    initEvents(){
        $(".close-btn").on("click" , (e) => {
            $(".change-new-profile-pic-wrap").addClass("hide")
            $(".add-contact-block-dialog-wrap").addClass("hide")
        })
    }

    //----------------------------------
    // setCroppieEditor
    //----------------------------------

    setCroppieEditor(img){ 
        let croppie = $(".change-new-profile-pic-wrap .change-new-profile-pic .pic-wrap").croppie({
        viewport: {
            width: 219,
            height: 204,
            type: 'circle'
        },
        boundary: {
            width: 500,
            height: 361
        },
        showZoomer: true
        });
        debugger;
        croppie.croppie('bind', {
            url: img
    });
    return croppie;
    }

    onResult(croppie){
        $(".mark-wrap").on("click" , (e) => {
            croppie.croppie('result', {
                type: 'rawcanvas',
                circle: true,
                format: 'png'
            }).then(function (canvas) {
                $(".change-profile-logo-img").prop("src",canvas.toDataURL());
                $(".change-profile-logo").addClass("hide");
                $(".change-profile-logo-img").removeClass("hide");
                $(".change-new-profile-pic-wrap").addClass("hide");
                $(".add-contact-block-dialog-wrap").addClass("hide")
            });
        })
    }
}