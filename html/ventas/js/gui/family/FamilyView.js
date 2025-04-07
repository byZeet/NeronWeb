const familyViewTemplate = $(document.getElementById("family-view-template").innerHTML);

class FamilyView{

    constructor(controller, family){
        this.dom = familyViewTemplate.clone();
        this.description = this.dom.find(".family-description");
        if(family.image){
            this.dom.addClass("with-image");
            this.dom.find(".family-image").on("error", ()=>{
                this.dom.removeClass("with-image").addClass("without-image");
            }).attr("src", "/"+family.image);
        } else{
            this.dom.addClass("without-image");
        }
        this.description.text(family.showDesc);
        this.dom.css("background-color", "#"+family.backgroundColor);
        this.description.css("color", "#"+family.textColor);
        this.dom.click(()=>{
            controller.familyTouch(family);
        });
    } 
}

export default FamilyView;