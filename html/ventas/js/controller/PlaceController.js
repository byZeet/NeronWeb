class PlaceController {

    constructor() {
        this.selectedPlace = null;
        this.selectedTable = null;
    }

    setNavigator(navigator) {
        this.navigator = navigator;
    }

    setIgnorePlaces(ignorePlaces) {
        this.ignorePlaces = ignorePlaces;
    }

    setPlaceMap(map) {
        this.placeMap = map;
        let visiblePlaces = Array.from(map.values()).filter((place) => {
            return !this.ignorePlaces.includes(place.id);
        });
        this.view.setPlaces(visiblePlaces);
    }

    updatePlaceNotifications(placeIds){
        if (!this.placeMap) return; // 👈 Protección contra null/undefined
    
        for(let place of this.placeMap.values()){
            let hasNotification = placeIds.includes(place.id);
            place.setHasNotifications(hasNotification);
        }
    }
    

    setView(view) {
        this.view = view;
    }

    setOutput(output){
        this.output = output;
    }

    setSelectedTable(table){
        this.selectedTabe = table;
    }

    refresh() {
        if (this.selectedPlace) {
            this.output.getTables(this.selectedPlace.id);
        }
    }

    setTables(tables) {
        if (!this.view) {
            return;
        }
        tables.sort((a,b)=>{
            let aOrder = a.order;
            let bOrder = b.order;
            if(aOrder>bOrder){
                return 1;
            }
            else if(aOrder<bOrder){
                return -1;
            }
            return 0;
        });
        this.view.addTables(tables);
    }

    placeTouch(place) {
        this.selectedPlace = place;
        this.view.selectPlace(place.id);
        this.output.getTables(place.id);
    }

    setTableCallback(callback){
        this.tableCallback = callback;
    }

    setBackCallback(callback){
        this.backCallback = callback;
    }

    setUnblockCallback(callback){
        this.unblockCallback = callback;
    }

    init(){
        this.blocked = false;
    }

    tableTouch(table) {
        if(this.blocked){
            return;
        }
        this.selectedTable = table;
        this.blocked = !this.tableCallback(table);
    }

    block(block){
        this.blocked = true;
    }

    goBack(){
        if(!this.backCallback){
            this.navigator.goBack();
            return;
        }
        this.backCallback();
    }

    unblock(response){
        if(!this.unblockCallback){
            this.blocked = false;
            return;
        }
        this.blocked = false;
        this.unblockCallback(response, this.selectedTable);
    }
}

export default PlaceController;