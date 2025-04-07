import ClientProtocol from "protocol/WebSocketClientProtocol.js";

class WebSocketController{

    constructor(app){
        this.app = app;
        this.startTime = window.performance.now();
    }
    
    acceptMessage(message){
        let object = JSON.parse(message);
        let response = object.Response;
        let command = response.C;
        let args = response.A;
        switch(command){
            case ClientProtocol.CONNECTION_OPEN:
                this.app.onConnectionOpen(args);
                break;
            case ClientProtocol.CONNECTION_ACCEPTED:
                this.app.onConnectionAccepted(args);
                break;
            case ClientProtocol.SEND_GROUPS:
                this.app.onAddGroups(args);
                break;
            case ClientProtocol.SEND_OPERATORS:
                this.app.onAddOperators(args);
                break;
            case ClientProtocol.SEND_PLACES:
                this.app.onAddPlaces(args);
                break;
            case ClientProtocol.SEND_TABLES:
                this.app.onAddTables(args);
                break;
            case ClientProtocol.SEND_TABLE:
                this.app.onTable(args);
                break;
            case ClientProtocol.SEND_FAMILY_TREE:
                this.app.onFamilyTree(args);
                break;
            case ClientProtocol.SEND_SCHEDULE:
                this.app.onSchedule(args);
                break;
            case ClientProtocol.SEND_CALIFICATORS:
                this.app.onCalificators(args);
                break;
            case ClientProtocol.OPERATOR_OPEN:
                this.app.changeOperator(args);
                break;
            case ClientProtocol.TICKET_MOVED:
                this.app.onTicketMoved(args);
                break;
            case ClientProtocol.OPERATOR_CLOSE:
                this.app.closeOperator();
                break;
            case ClientProtocol.PING:
                this.app.onPong();
                break;
            case ClientProtocol.PERMISSION_RESPONSE:
                this.app.onPermissionResponse(args);
                break;
            case ClientProtocol.SEND_CLIENTS:
                this.app.onAddClients(args);
                break;
            case ClientProtocol.SEND_PAYMENT_WAYS:
                this.app.onAddPaymentWays(args.PW);
                this.app.onAddPrintingModifiers(args.PM);
                this.app.onAddPermissions(args.Perm);
                this.app.onAddPeripherals(args.Peripherals);
                break;
            case ClientProtocol.TABLE_OPEN:
                this.app.onTableOpen(args);
                break;
            case ClientProtocol.PRODUCT_STOCK:
                this.app.onProductStock(args);
                break;
            case ClientProtocol.PLACE_NOTIFICATIONS:
                this.app.onPlaceNotifications(args);
                break;
            case ClientProtocol.HOTEL_ROOM:
                this.app.onHotelRoom(args);
                break;
        }
    }
}

export default WebSocketController;