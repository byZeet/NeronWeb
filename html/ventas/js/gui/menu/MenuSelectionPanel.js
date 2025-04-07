import MenuSelectionView from "./MenuSelectionView.js";

const menuSelectionPanelTemplate = document.getElementById("menu-selection-panel-template").innerHTML;

class MenuSelectionPanel{

    constructor(){
        this.dom = $(menuSelectionPanelTemplate);
        this.header = this.dom.find(".menu-selection-header");
        this.group = this.header.find(".menu-selection-group");
        this.description = this.header.find(".menu-selection-description");
        this.content = this.dom.find(".menu-selection-lines");
    }

    setController(controller){
        this.controller = controller;
    }

    setSelection(group, quantity, product){
        this.group.text(group.desc);
        this.description.text("("+quantity+") "+product.description);
        this.header.css("border-left-color", "#"+group.color);
    }

    setLines(lines){
        this.content.html("");
        for(let line of lines){
            let quantity = line.quantity;
            let menuSelectionView = new MenuSelectionView(this.controller, line);
            this.content.append(menuSelectionView.dom);
        }
    }

}

export default MenuSelectionPanel;