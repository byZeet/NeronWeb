import Observable from "lib/util/Observable.js";

class CalificatorGroupModel{
    constructor(group){
        this.calificators = [];
        this.observable = new Observable();
    }

    getObservable(){
        return this.observable;
    }

    setId(id){
        this.id = id;
    }

    setDescription(description){
        this.description = description;
    }

    setIsAll(isAll){
        this.isAll = isAll;
    }

    addCalificator(calificator){
        this.calificators.push(calificator);
        this.observable.notify("addCalificator", calificator);
    }


}

export default CalificatorGroupModel;