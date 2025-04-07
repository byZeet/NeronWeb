import MenuView from "./MenuView.js";

const menuPanelTemplate = document.getElementById("menu-panel-template").innerHTML;

class MenuPanel{

    constructor(){
        this.dom = $(menuPanelTemplate);
        this.header = this.dom.find(".menu-group-description");
        this.menuName = this.dom.find(".menu-name");
        this.dom.find(".prev-button").click(()=>{
            this.controller.previousGroup();
        });
        this.dom.find(".next-button").click(()=>{
            this.controller.nextGroup();
        });
        this.content = this.dom.find(".menu-content");
        this.views = new Map();
        this.groupViews = new Map();
    }

    setController(controller){
        this.controller = controller;
    }

    changeMenu(menu){
        this.menuName.text(menu.showDesc);
        let menuLines = menu.menuLines;
        this.groupViews.clear();
        menuLines.forEach((value, key)=>{
            this.newGroup(key);
            for(let product of value){
                this.newProduct(key, product);
            };
        });
    }

    changeGroup(group){
        this.header.text(group.desc);
        let views = this.groupViews.get(group.id);
        this.content.children().detach();
        for(let view of views){
            this.content.append(view.dom);
        }
        this.dom.parent().scrollTop(0);
    }

    getMenuView(group, id){
        return this.views.get(group+"@"+id);
    }

    newGroup(groupId){
        this.groupViews.set(groupId, []);
    }

    newProduct(groupId, product){
        let view = new MenuView(this.controller, product, groupId);
        this.views.set(groupId+"@"+product.id, view);
        let groupArray = this.groupViews.get(groupId);
        groupArray.push(view);
    }
    
}

export default MenuPanel;