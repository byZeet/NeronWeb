const clientViewTemplate = document.getElementById("client-view-template").innerHTML;

class ClientView{

    constructor(controller, client){
        this.dom = $(clientViewTemplate);
        this.dom.find(".client-dni").text(client.dni);
        this.dom.find(".client-name").text(client.name);
        this.dom.click(()=>{
            controller.clientTouch(client);
        });
    }
}

export default ClientView;