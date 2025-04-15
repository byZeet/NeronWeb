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

        const visiblePlaces = Array.from(map.values()).filter((place) => {
            return !this.ignorePlaces.includes(place.id);
        });

        this.view.setPlaces(visiblePlaces);
    }

    updatePlaceNotifications(placeIds) {
        if (!this.placeMap) {
            console.warn("⚠️ placeMap no está definido todavía.");
            return;
        }

        for (let place of this.placeMap.values()) {
            const hasNotification = placeIds.includes(place.id);
            if (typeof place.setHasNotifications === "function") {
                place.setHasNotifications(hasNotification);
            } else {
                console.warn("⚠️ No se puede aplicar notificación en place:", place);
            }
        }
    }

    setView(view) {
        this.view = view;
    }

    setOutput(output) {
        this.output = output;
    }

    setSelectedTable(table) {
        this.selectedTable = table;
    }

    refresh() {
        if (this.selectedPlace) {
            this.output.getTables(this.selectedPlace.id);
        }
    }
    
    // Ordenamos las mesas por el campo "order" en orden ascendente
    setTables(tables) {
        if (!this.view) return;

        tables.sort((a, b) => {
            return a.order - b.order;
        });

        this.view.addTables(tables);
    }

    placeTouch(place) {
        this.selectedPlace = place;
        this.view.selectPlace(place.id);
        this.output.getTables(place.id);
    }

    setTableCallback(callback) {
        this.tableCallback = callback;
    }

    setBackCallback(callback) {
        this.backCallback = callback;
    }

    setUnblockCallback(callback) {
        this.unblockCallback = callback;
    }

    init() {
        this.blocked = false;
    }

    tableTouch(table) {
        if (this.blocked) return;

        this.selectedTable = table;
        this.blocked = !this.tableCallback(table);
    }

    block(block) {
        this.blocked = true;
    }

    goBack() {
        if (!this.backCallback) {
            this.navigator.goBack();
            return;
        }
        this.backCallback();
    }

    unblock(response) {
        if (!this.unblockCallback) {
            this.blocked = false;
            return;
        }

        this.blocked = false;
        this.unblockCallback(response, this.selectedTable);
    }
}

export default PlaceController;
