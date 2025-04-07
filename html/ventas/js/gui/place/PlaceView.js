const placeViewTemplate = document.getElementById("place-view-template").innerHTML;

class PlaceView{

    constructor(controller, place){
        this.place = place;
        this.dom = $(placeViewTemplate);
        this.dom.find(".place-name").text(place.name);
        //this.dom.css({backgroundColor: "#"+place.backgroundColor});
        let backgroundString = "#"+place.backgroundColor;
        this.dom.css("--background-color", backgroundString);
        this.dom.click(()=>{
            controller.placeTouch(place);
        });
    } 

    select(){
        this.dom.addClass("selected");
    }

    unselect(){
        this.dom.removeClass("selected");
    }

    setHasNotifications(hasNotifications){
        if(hasNotifications){
            this.dom.addClass("has-notification");
        } else{
            this.dom.removeClass("has-notification");
        }
    }
}

export default PlaceView;