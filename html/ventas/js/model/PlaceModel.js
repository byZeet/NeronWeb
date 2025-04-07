import ColorUtil from "lib/util/ColorUtil.js";
import Observable from "lib/util/Observable.js";

class PlaceModel{
    constructor(){
        this.observable = new Observable();
        this.tables = new Map();
    }

    setId(id){
        this.id = id;
    }

    setName(name){
        this.name = name;
    }

    setBackgroundColor(backgroundColor){
        this.backgroundColor = backgroundColor;
    }

    setPriceId(priceId){
        this.priceId = priceId;
    }

    setAskDinners(askDinners){
        this.askDinners = askDinners;
    }

    setDefaultDocType(defaultDocType){
        this.defaultDocType = defaultDocType;
    }

    setTPV(tpv){
        this.tpv = tpv;
    }

    getObservable(){
        return this.observable;
    }

    addTable(table){
        this.tables.set(table.id, table);
    }

    getTable(id){
        return this.tables.get(id);
    }

    setHasNotifications(hasNotifications){
        this.hasNotifications = hasNotifications;
        this.observable.notify("setHasNotifications", hasNotifications);
    }
}

export default PlaceModel;