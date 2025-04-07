import PlaceView from "./PlaceView.js";
import TableView from "./TableView.js";


const placePanelTemplate = document.getElementById("place-panel-template").innerHTML;

class PlacePanel{

    constructor(){
        this.dom = $(placePanelTemplate);
        this.placesDom = this.dom.find(".place-div");
        this.tablesDom = this.dom.find(".table-div");
        this.placeViews = new Map();
        this.tableViews = new Map();
        this.selectedPlaceView = null;
    } 

    setController(controller){
        this.controller = controller;
    }

    setPlaces(places){
        for(let place of places){
            let placeView = new PlaceView(this, place);
            place.getObservable().addObserver(placeView);
            this.placeViews.set(place.id, placeView);
            this.placesDom.append(placeView.dom);
        }
    }

    showTables(place){
        this.tablesDom.children().detach();
        for(let tableView of this.tableViews.values()){
            if(tableView.table.place.id == place.id){
                this.tablesDom.append(tableView.dom);
            }
        }
    }

    addTables(tables){
        this.tablesDom.html("");
        for(let table of tables){
            let tableView = new TableView(this, table);
            this.tableViews.set(table.id, tableView);
            this.tablesDom.append(tableView.dom);
        }
    }

    selectPlace(id){
        if(this.selectedPlaceView!=null){
            this.selectedPlaceView.unselect();
        }
        this.selectedPlaceView = this.placeViews.get(id);
        this.selectedPlaceView.select();
    }

    /*updatePlaceNotifications(placeIds){
        for(let placeView of this.placeViews.values()){
            placeView.removeClass("has-notifications");
        }
        for(let placeId of this.placeIds.values()){
            let placeView = this.placeViews
            placeView.removeClass("has-notifications");
        }
    }*/

    //Event
    placeTouch(table){
        this.controller.placeTouch(table);
    }

    tableTouch(table){
        this.controller.tableTouch(table);
    }
}

export default PlacePanel;