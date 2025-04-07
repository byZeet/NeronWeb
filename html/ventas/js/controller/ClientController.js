class ClientController{
    
    setView(view){
        this.view = view;
    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setOutput(output){
        this.output = output;
    }

    setSelectedClientCallback(callback){
        this.clientSelectedCallback = callback;
    }

    setSearch(search){
        this.output.getClients(search);
    }

    setClients(clients){
        clients = clients.filter(client=>client.id != "0");
        this.view.setClients(clients);
    }

    clientTouch(client){
        this.modalController.confirm("Asignando cliente", 
        "¿Estás seguro de querer asignar este cliente?<br><br><b>("
        +client.dni+") "+client.name.toUpperCase()+"</b>",
        ()=>{
            this.navigator.goBack();
            this.clientSelectedCallback(client);
        });
    }
    
    searchTouch(){
        this.modalController.askTextInput("Buscando clientes", "", "", (search)=>{
            this.setSearch(search);
        });
    }
}

export default ClientController;