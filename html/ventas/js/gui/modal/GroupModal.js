const groupModalTemplate = document.getElementById("group-modal-template").innerHTML;
const groupModalViewTemplate = document.getElementById("group-modal-view-template").innerHTML;

class GroupModal{

    constructor(){
        this.dom = $(groupModalTemplate);
        this.content = this.dom.find(".modal-content");
        this.groups = null;
        this.callback = null;

        this.closeButton = this.dom.find(".modal-close");

        this.closeButton.click(()=>{
            this.modalController.hide();
        });

    }

    setModalController(controller){
        this.modalController = controller;
    }

    setGroups(groups){
        this.groups = groups;
        this.content.html("");
        let groupView = $(groupModalViewTemplate);
        for(let group of groups){
            this.addGroup(group);
        }
    }

    addGroup(group){
        let groupView = $(groupModalViewTemplate);
        groupView.find(".group-description").text(group.desc);
        groupView.find(".group-color-band").css({
            backgroundColor: "#"+group.color
        });
        groupView.click(()=>{
            this.modalController.hide();
            this.callback(group.id);
        });
        this.content.append(groupView);
    }

    setCallback(callback){
        this.callback = callback;
    }

    
}

export default GroupModal;