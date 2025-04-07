import Navigator from "../app/Navigator.js";

const titleMap = new Map([
    [Navigator.StateOperator, "Elección de operador"],
    [Navigator.StateFamily, "Elección de familia"],
    [Navigator.StateProduct, "Elección de producto"],
    [Navigator.StateCombinedProduct, "Elección de combinado"],
    [Navigator.StateTicket, "Documento actual"],
    [Navigator.StateCalificator, "Elección de descriptores"],
    [Navigator.StateFastFood, "Elección de ingredientes"],
    [Navigator.StateMenu, "Elección de platos"],
    [Navigator.StateMenuSelection, "Modificación de platos"],
    [Navigator.StateClient, "Búsqueda de clientes"],
    [Navigator.StateSaleClosing, "Cierre de venta"]
 ]);

class RootPanel{

    constructor(){
        this.panelContainer = $("#panel-container");
        this.header = $("#header");
        this.title = this.header.find(".bottom-info");
        this.commanderName = this.header.find(".commander-name");
        this.slash = this.header.find(".slash");
        this.operatorName = this.header.find(".operator-name");
    }

    setPanelMap(map){
        this.panelMap = map;
    }

    setButtonNav(buttonNav){
        this.buttonNav = buttonNav;
    }

    switchState(state, controller){
        let panel = this.panelMap.get(state.type);
        //controller.setView(panel);
        let title;
        if(state.title){
            title = state.title;
        } else{
            title = titleMap.get(state.type);
        }
        panel.setController(controller);
        this.buttonNav.setController(controller);
        this.setTitle(title);
        this.switchTo(panel.dom);
    }

    switchTo(dom){
        this.panelContainer.children().detach();
        this.panelContainer.html(dom);
    }

    setTitle(text){
        this.title.text(text);
    }

    setCommanderName(name){
        this.commanderName.text(name);
    }

    setOperatorName(name){
        this.operatorName.text(name);
        if(name==""){
            this.slash.text("");
        } else{
            this.slash.text("/");
        }
    }

    empty(){
        //this.panelContainer.find(":not(.product-bubble)").detach();
        this.panelContainer.children().detach();
    }
    
}

export default RootPanel;