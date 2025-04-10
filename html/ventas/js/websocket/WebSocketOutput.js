import ServerProtocol from "../../../protocol/WebSocketServerProtocol.js";
import LineEncoder from "../model/encoder/LineEncoder.js";


class WebSocketOutput {
    constructor(socket) {
        this.socket = socket;
        this.lineEncoder = new LineEncoder();
    }
    _sendCommand(command, args = null) {
        var object = {
            C: command,
        }
        if (args !== null) {
            object.A = args;
        }
        this.socket.send(JSON.stringify(object));
    }
    getGroups() {
        this._sendCommand(ServerProtocol.GET_GROUPS);
    }
    getOperators() {
        this._sendCommand(ServerProtocol.GET_OPERATORS);
    }
    getPlaces() {
        this._sendCommand(ServerProtocol.GET_PLACES);
    }
    getTables(placeId) {
        this._sendCommand(ServerProtocol.GET_TABLES, {
            Id: placeId
        });
    }
    getFamilyTree() {
        this._sendCommand(ServerProtocol.GET_FAMILY_TREE);
    }
    getCalificators() {
        this._sendCommand(ServerProtocol.GET_CALIFICATORS);
    }

    getPaymentWays() {
        this._sendCommand(ServerProtocol.GET_PAYMENT_WAYS);
    }

    getClients(searchToken){
        this._sendCommand(ServerProtocol.GET_CLIENTS, {
            P: 1,
            C: 50,
            Tok: searchToken
        });
    }

    newLines(linesParam){
        this._sendCommand(ServerProtocol.NEW_TICKET_LINE, this.lineEncoder.encodeLines(linesParam));
    }

    insertKitchenNotices(linesParam){
        this._sendCommand(ServerProtocol.INSERT_KITCHEN_NOTICES, this.lineEncoder.encodeLines(linesParam));
    }

    updateLines(linesParam){
        this._sendCommand(ServerProtocol.UPDATE_TICKET_LINES, this.lineEncoder.encodeLines(linesParam));
    }
    
    openConnection(objParam){
        let obj = {
            T: 1,
            ComId: objParam.commanderId
        };
        if(objParam.hasOwnProperty("operatorId")){
            obj.OpId = objParam.operatorId;
        }
        if(objParam.hasOwnProperty("password")){
            obj.Pswd = objParam.password;
        }
        if(objParam.hasOwnProperty("connectionToken")){
            obj.Tok = objParam.connectionToken;
        }
        this._sendCommand(ServerProtocol.OPEN_CONNECTION, obj);
    }

    closeOperator(){
        this._sendCommand(ServerProtocol.CLOSE_OPERATOR);
    }

    getSchedule() {
        this._sendCommand(ServerProtocol.GET_SCHEDULE);
    }

    getTable(tableId){
        this._sendCommand(ServerProtocol.GET_TABLE, {Id: tableId});
    }

    deleteTicketLines(lines) {
        this._sendCommand(ServerProtocol.DELETE_TICKET_LINES, lines);
    }

    newCalificator(type, description){
        this._sendCommand(ServerProtocol.NEW_CALIFICATOR, {
            T: type,
            Des: description
        });
    }

    toKitchen(tableId){
        this._sendCommand(ServerProtocol.TO_KITCHEN, tableId);
    }

    moveLine(line, table){
        /*console.log(this.getDate());
        console.trace();*/
        this._sendCommand(ServerProtocol.MOVE_TICKET_LINE, {
            Id: line.id,
            TabId: table.id
        });
    }

    moveLines(selections, table){
        /*console.log(this.getDate());
        console.trace();*/
        let lines = selections.map((selection)=>{
            return {
                Id: selection.line.id,
                Quantity: selection.selectedQuantity
            }
        });
        this._sendCommand(ServerProtocol.MOVE_TICKET_LINE, {
            Lines: lines,
            TabId: table.id
        });
    }

    moveTicket(origin, target, kitchen){
        /*console.log(this.getDate());
        console.log("De "+origin.description+" a "+target.description);
        console.trace();*/
        this._sendCommand(ServerProtocol.MOVE_TICKET, {
            SrcTabId: origin.id,
            TarTabId: target.id,
            K: kitchen
        });
    }

    updateTableDinners(tableId, dinners){
        this._sendCommand(ServerProtocol.UPDATE_TABLE_DINNERS, {
            TabId: tableId,
            Din: dinners
        });
    }

    updateTableClient(tableId, client){
        this._sendCommand(ServerProtocol.UPDATE_TABLE_CLIENT, {
            TabId: tableId,
            ClId: client.id
        });
    }

    deleteTicket(tableId){
        this._sendCommand(ServerProtocol.DELETE_TICKET, {
            TabId: tableId
        });
    }

    insertPrintCommand(tableId, type){
        this._sendCommand(ServerProtocol.INSERT_PRINT_COMMAND, {
            TabId: tableId,
            T: type
        });
    }

    sendPing(){
        this._sendCommand(ServerProtocol.PONG);
    }

    clientError(message, url, lineNumber){
        this._sendCommand(ServerProtocol.CLIENT_ERROR, {
            Message: message,
            Url: url,
            LineNumber: lineNumber
        });
    }

    demandLines(ids){
        this._sendCommand(ServerProtocol.DEMAND_LINE, {
            LineIds: ids
        });
    }

    askNextDishes(lines){
        this._sendCommand(ServerProtocol.ASK_NEXT_DISHES, {
            LineIds: lines
        });
    }

    askPermission(type, password){
        this._sendCommand(ServerProtocol.ASK_PERMISSION, {
            T: type,
            Pswd: password
        });
    }

    closeSale(obj){
        let res = {
            Ta: obj.table.id,
            Doc: obj.docType.id,
            Dis: obj.discount,
            Tin: obj.tin,
            PeripheralId: obj.peripheralId
        }
        let basePrintingModifier = {
            "Na": obj.modifier.description,
            "Q": obj.modifier.quantity
        };
        let basePayments = [];
        basePayments.push({
            "M": obj.paymentWays[0],
            "A": 0
        });
        if(obj.paymentWays.length>=2){
            basePayments[0].A = obj.prices[0].toFixed(2); 
            basePayments.push({
                "M": obj.paymentWays[1],
                "A": obj.prices[1].toFixed(2)
            }); 
        }
        let baseClientId = obj.client == null ? "0" : obj.client.id;
        baseClientId = obj.receverQr !== ""? obj.receverQr : baseClientId;
        let baseDinner = {
            "Id": baseClientId,
            "P": basePayments,
            "PM": basePrintingModifier
        }
        res.D = [];
        for(let o of obj.clients){
            let dinner = {
                Id: o.client == null ? "0" : o.client.id,
                P: [{
                    M: o.paymentWay.id,
                    A: o.total.toFixed(2)
                }],
                PM: {
                    Na: o.modifierSelection.modifier == null ? "0" : o.modifierSelection.modifier.id,
                    Q: o.modifierSelection.quantity
                }
            }
            res.D.push(dinner);
        }
        if(res.D.length==0){
            res.D.push(baseDinner);
        }
        res.L = obj.lineSelections.map((selection)=>{
            return {
                "Id": selection.line.id,
                "Q": selection.selectedQuantity
            }
        });
        this._sendCommand(ServerProtocol.CLOSE_SALE, res);
    }


    openTable(table){
        this._sendCommand(ServerProtocol.OPEN_TABLE, {
            Ta: table.id
        });
    }

    closeTable(table){
        this._sendCommand(ServerProtocol.CLOSE_TABLE, {
            Ta: table.id
        });
    }

    markNotification(table){
        this._sendCommand(ServerProtocol.MARK_NOTIFICATION, {
            Ta: table.id
        });
    }

    askHotelRoom(roomId){
        this._sendCommand(ServerProtocol.ASK_HOTEL_ROOM, {
            RoomId: roomId
        });
    }

    transferHotelRoom(dto){
        this._sendCommand(ServerProtocol.TRANSFER_HOTEL_ROOM, {
            TableId: dto.tableId,
            RoomId: dto.room.id,
            Type: dto.code,
            Client: dto.client.key,
        });
    }

    seatReserve(reserveId){
        this._sendCommand(ServerProtocol.SEAT_RESERVE, {
            Id: reserveId
        });
    }

    getDate(){
        var date = new Date();
        return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
    }

    searchProducts(searchText) {
        this._sendCommand(44, { Search: searchText });
    }
    
    
}

export default WebSocketOutput;