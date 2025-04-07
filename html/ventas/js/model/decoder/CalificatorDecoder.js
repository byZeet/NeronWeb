import CalificatorModel from "../CalificatorModel.js";
import CalificatorGroupModel from "../CalificatorGroupModel.js";
import Observable from "lib/util/Observable.js";

class CalificatorDecoder{

    constructor(){
        this.observable = new Observable();
        this.groupMap = new Map();
        this.calificatorMap = new Map();
    }   

    setCalificatorController(controller){
        this.calificatorController = controller;
    }

    decodeGroups(groups){
        for(let group of groups){
            let groupModel = this.groupMap.get(group.Id);
            if(!groupModel){
                groupModel = this.decodeGroup(group);
                this.calificatorController.addGroup(groupModel);
                this.groupMap.set(groupModel.id, groupModel);
            }
            this.updateGroup(groupModel, group);
        }
        this.calificatorController.sort();
        return {
            calificatorMap: this.calificatorMap,
            groupMap: this.groupMap
        }
    }

    decodeGroup(group){
        let groupModel = new CalificatorGroupModel();
        groupModel.setId(group.Id);
        groupModel.setDescription(group.D);
        groupModel.setIsAll(group.hasOwnProperty("All"));
        return groupModel;
    }

    updateGroup(groupModel, group){
        if(group.hasOwnProperty("Ca")){
            this.decodeCalificators(groupModel, group.Ca);
        }
    }

    decodeCalificators(groupModel, calificators){
        for(let i=0; i<calificators.length; i++){
            let calificator = calificators[i]
            let calificatorModel = this.calificatorMap.get(calificator.Id);
            if(!calificatorModel){
                calificatorModel = this.decodeCalificator(calificator);
                calificatorModel.setGroup(groupModel);
                this.calificatorMap.set(calificatorModel.id, calificatorModel);
                groupModel.addCalificator(calificatorModel);
            }
            calificatorModel.setOrder(i);
        }
    }

    decodeCalificator(calificator){
        let calificatorModel = new CalificatorModel();
        calificatorModel.setId(calificator.Id);
        calificatorModel.setDescription(calificator.D);
        return calificatorModel;
    }

}

export default CalificatorDecoder;