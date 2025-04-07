import CalificatorGroupView from "./CalificatorGroupView.js";
import CalificatorView from "./CalificatorView.js";

const calificatorPanelTemplate = document.getElementById("calificator-panel-template").innerHTML;

class CalificatorPanel{

    constructor(){
        this.dom = $(calificatorPanelTemplate);
        this.content = this.dom.find(".calificators-content");
        this.header = this.dom.find(".calificator-group-description");
        this.dom.find(".prev-button").click(()=>{
            this.controller.prevState();
        });
        this.dom.find(".next-button").click(()=>{
            this.controller.nextState();
        });
        this.calificators = new Map();
        this.lists = new Map();
        this.groupView = new CalificatorGroupView();
        this.groupView.setDom(this.content);
    }

    setController(controller){
        this.controller = controller;
    }

    addGroup(group){
        this.lists.set(group.id, []);
    }

    addCalificator(calificator){
        let groupId = calificator.group.id;
        let list = this.lists.get(groupId);
        if(!list){
            return;
        }
        let calificatorView = new CalificatorView(calificator);
        calificatorView.setController(this);
        this.calificators.set(calificator.id, calificatorView);
        list.push(calificatorView);
        if(this.group == null){
            return;
        }
        if(this.group.isAll || this.group === calificator.group){
            this.groupView.addCalificatorView(calificatorView);
        }
    }

    setRequiredGroup(group){
        this.requiredGroup = group;
    }

    changeGroup(group){
        this.header.text(group.description);
        this.group = group;
        this.groupView.empty();
        if(group.isAll){
            this.lists.forEach((list)=>{
                this.addList(list);
            });
        } else{
            let list = this.lists.get(group.id);
            this.list = list;
            this.addList(list);
        }

        this.dom.removeClass("required");
        if(group === this.requiredGroup){
            this.dom.addClass("required");
        }
        this.dom.parent().scrollTop(0);
    }

    addList(list){
        list.sort((a, b)=>{
            return a.calificator.order - b.calificator.order;
        })
        for(let view of list){
            this.groupView.addCalificatorView(view);
        }
    }

    reset(){
        for(let view of this.calificators.values()){
            view.unselect();
        }
    }

    calificatorTouch(calificator){
        this.controller.toggleSelected(calificator);
    }

    select(calificatorId){
        this.calificators.get(calificatorId).select();
    }

    unselect(calificatorId){
        this.calificators.get(calificatorId).unselect();
    }

    sort(){
        if(!this.group) return;
        this.changeGroup(this.group);
    }
}

export default CalificatorPanel;