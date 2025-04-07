
import Observable from "./Observable.js";

class ObservableMap extends Map{

    constructor(){
        super();
        this.observable = new Observable();
    }

    set(key, value){
        this.observable.notify("onItemAdded", {
            key,
            value
        });
        super.set(key, value);
    }

    delete(key){
        this.observable.notify("onItemRemoved", key);
        super.delete(key);
    }
}

export default ObservableMap;