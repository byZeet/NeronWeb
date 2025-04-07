import ClientView from "./ClientView.js";

const clientPanelTemplate = document.getElementById("client-panel-template").innerHTML;

class ClientPanel{
    constructor(){
        this.dom = $(clientPanelTemplate);
        this.content = this.dom.find(".client-panel-content");
    }

    setController(controller){
        this.controller = controller;
    }

    setClients(clients){
        this.content.html("");
        for(let client of clients){
            let clientView = new ClientView(this, client);
            this.content.append(clientView.dom);
        }
    }

    //Events
    clientTouch(client){
        this.controller.clientTouch(client);
    }

    

    
}

export default ClientPanel;