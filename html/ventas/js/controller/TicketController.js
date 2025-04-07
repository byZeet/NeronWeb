import Constants from "../app/Constants.js";
import Navigator from "../app/Navigator.js";
import ModalController from "./ModalController.js";
import DemandLinesCreator from "./demand/DemandLinesCreator.js";

import GP from "../app/GlobalParameters.js";
import GlobalParameters from "../app/GlobalParameters.js";

class TicketController {

    constructor() {
        this.demandLinesCreator = new DemandLinesCreator();
    }

    setPermissionManager(permissionManager){
        this.permissionManager = permissionManager;
    }

    setModalController(controller) {
        this.modalController = controller;
    }
    
    setOrderController(controller){
        this.orderController = controller;
    }

    setOutput(output) {
        this.output = output;
    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setView(view) {
        this.view = view;
    }

    setPrintTicketConfirm(printTicketConfirm){
        this.printTicketConfirm = printTicketConfirm;
    }

    setDeleteLineConfirm(deleteLineConfirm){
        this.deleteLineConfirm = deleteLineConfirm;
    }

    setGroups(groups) {
        this.groups = groups;
    }

    setGroupModal(modal){
        this.groupModal = modal;
    }

    editMenu(line){
        let rootLine = line.getRootLine();
        let lineMap = new Map();
        let selections = [];
        let currentId = 1;
        for(let subline of rootLine.getSublines()){
            let selection = {
                id: currentId,
                group: subline.group.id,
                product: subline.product,
                quantity: subline.quantity,
                calificators: subline.calificators
            }
            if(subline.isFastFood()){
                selection.fastFoodSelections = this.eff_fastFoodSelections(subline);
            }
            selections.push(selection);
            lineMap.set(currentId, subline);
            currentId++;
        }
        this.navigator.navigateTo({
            type: Navigator.StateMenu,
            product: rootLine.product,
            quantity: rootLine.quantity,
            selections: selections,
            hiddenButtons: ["next-menu-button"],
            sendCallback: (selections)=>{
                this.orderController.menu_edit(selections, rootLine, lineMap);
            }
        });
    }

    editFastFood(line){
        if(line.isFastFoodIngredient()){
            line = line.superline;
        }
        let selections = [];
        for(let subline of line.getSublines()){
            selections.push({
                type: subline.extraType,
                part: subline.extraHalf,
                id: subline.product.id,
                quantity: subline.quantity
            });
        }
        this.navigator.navigateTo({
            type: Navigator.StateFastFood,
            product: line.product,
            quantity: 1,
            selections: this.eff_fastFoodSelections(line),
            calificators: line.calificators,
            sendCallback: (items)=>{
                this.orderController.ff_edit(items, line);
            }
        });
    }

    /*eff_fastFoodSelections(line){
        let selections = [];
        for(let subline of line.getSublines()){
            let ingredient;
            if(subline.isBasic()){
                ingredient = line.product.basics.get(subline.product.id);
            } else{
                ingredient = line.product.extras.get(subline.product.id);
            }
            if(!ingredient){
                continue;
            }
            selections.push({
                type: subline.extraType,
                part: subline.extraHalf,
                id: ingredient.id,
                ingredient: ingredient
            });
        }
        return selections;
    }*/

    eff_fastFoodSelections(line){
        let selections = new Map();
        for(let subline of line.getSublines()){
            let ingredient;
            if(subline.isBasic()){
                ingredient = line.product.basics.get(subline.product.id);
            } else{
                ingredient = line.product.extras.get(subline.product.id);
            }
            if(!ingredient){
                continue;
            }
            let id = subline.extraType+"@"+ingredient.id;
            let key = subline.extraHalf+"$"+id;
            let selection = selections.get(key);
            if(selection == null){
                selection = {
                    type: subline.extraType,
                    part: subline.extraHalf,
                    id: ingredient.id,
                    ingredient: ingredient,
                    quantity: subline.isBasic()?-1:0
                }
                selections.set(key, selection);
            }
            selection.quantity+=subline.quantity;
        }
        return Array.from(selections.values());
    }

    demandLine(line){
        this.navigator.navigateTo({
            type: Navigator.StateDemand,
            lines: this.dl_getLines(line),
            title: "Reclamación de platos",
            sendCallback: (selections)=>{
                let lineIds = [];
                for(let selection of selections){
                    lineIds.push({
                        LineId: selection.line.id,
                        Quantity: selection.selectedQuantity
                    });
                }
                this.output.demandLines(lineIds);
                this.refreshTicket();
                this.modalController.alert("Platos reclamados", "Los platos han sido reclamados.");
            }
        });
    }

    dl_getLines(line){
        this.demandLinesCreator.setLines(this.table.getAllLines());
        this.demandLinesCreator.filter((line)=>{
            let valid = true;
            valid = valid && line.kitchen;
            valid = valid && !line.isKitchenNotice();
            valid = valid && !line.isFastFoodIngredient();
            return valid;
        });
        this.demandLinesCreator.setSelectedQuantityCallback((_line)=>{
            return line.id == _line.id?line.quantity:0;
        });
        return this.demandLinesCreator.getDemandLines();
    }

    askNextDishes(line){
        this.navigator.navigateTo({
            type: Navigator.StateDemand,
            lines: this.and_getLines(line),
            title: "Siguientes platos",
            sendCallback: (selections)=>{
                let lines = [];
                for(let selection of selections.values()){
                    lines.push({
                        LineId: selection.line.id,
                        Quantity: selection.selectedQuantity
                    });
                }
                this.output.askNextDishes(lines);
                this.refreshTicket();
                this.modalController.alert("Platos pedidos", "Los platos han sido pedidos.");
            }
        });
    }

    and_getLines(line){
        this.demandLinesCreator.setLines(this.table.getAllLines());
        this.demandLinesCreator.filter((line)=>{
            let valid = true;
            valid = valid && line.kitchen;
            valid = valid && !line.isKitchenNotice();
            valid = valid && !line.isFastFoodIngredient();
            valid = valid && line.getUnaskedQuantity()>0;
            return valid;
        });
        this.demandLinesCreator.setQuantityCallback((line)=>{
            return line.getUnaskedQuantity();
        });
        this.demandLinesCreator.setSelectedQuantityCallback((_line)=>{
            return line.id == _line.id?line.getUnaskedQuantity():0;
        });
        return this.demandLinesCreator.getDemandLines();
    }
    
    changeTable(table) {
        this.table = table;
        this.view.changeTable(table);
    }

    lineTouch(line) {
        if(line.isKitchenNotice()){
            this.deleteLine(line);
        } else{
            let rootLine = line;
            if(line.isFastFoodIngredient() && !GP.FF_INGREDIENTS_EDIT){
                rootLine = line.superline;
            }
            this.modalController.ticketLine(rootLine);
        }
    }

    updateGroup(line, group) {
        if (line.isMenu()) {
            return;
        }
        let rootLine = line;
        if (line.isFastFoodIngredient()) {
            rootLine = line.superline;
        }
        let lines = [{
            id: rootLine.id,
            group: group
        }];
        for (let subline of rootLine.getSublines()) {
            lines.push({
                id: subline.id,
                group: group
            });
        }
        this.output.updateLines(lines);
        this.refreshTicket();
    }

    updatePrice(line) {
        let permission = this.askPermission(Constants.PERMISSION_EDIT_PRICE, ()=>{
            this.updatePrice(line);
        });
        if(!permission){
            return;
        }
        this.modalController.askPriceInput("Modificando precio", "Precio:", line.price, (price)=>{
            this.updatePrice_update(line, price);
        });
    }

    updatePrice_update(line, price){
        let obj = {};
        obj.id = line.id;
        obj.price = price;
        obj.unitPrice = parseFloat((obj.price/line.quantity).toFixed(2));
        this.output.updateLines([obj]);
        this.refreshTicket();
    }

    updateUnitPrice(line) {
        let permission = this.askPermission(Constants.PERMISSION_EDIT_PRICE, ()=>{
            this.updateUnitPrice(line);
        });
        if(!permission){
            return;
        }
        this.modalController.askPriceInput("Modificando precio unitario", "Precio unitario:", line.unitPrice, (price)=>{
            this.updateUnitPrice_update(line, price);
        });
    }

    updateUnitPrice_update(line, unitPrice){
        let obj = {};
        obj.id = line.id;
        obj.unitPrice = unitPrice;
        obj.price = parseFloat((obj.unitPrice * line.quantity).toFixed(2));
        this.output.updateLines([obj]);
        this.refreshTicket();
    }

    updateQuantity(line){
        let permission = this.askPermission(Constants.PERMISSION_EDIT_QUANTITY, ()=>{
            this.updateQuantity(line);
        });
        if(!permission){
            return;
        }
        let type = line.isMenu()?ModalController.TYPE_INTEGER:ModalController.TYPE_DOUBLE;
        this.modalController.askInput(type, "Modificando cantidad", "Cantidad:", "", (quantity)=>{
            this.updateQuantity_update(line, quantity);
        });
    }

    updateQuantity_update(line, quantity) {
        if(quantity==0){
            quantity = 1;
        }
        let obj = {};
        obj.id = line.id;
        obj.quantity = quantity;
        obj.price = parseFloat((line.unitPrice * quantity).toFixed(2));
        this.output.updateLines([obj]);
        this.refreshTicket();
    }


    discount(line) {
        let permission = this.askPermission(Constants.PERMISSION_DISCOUNT, ()=>{
            this.discount(line);
        });
        if(!permission){
            return;
        }
        this.modalController.askDoubleInput("Aplicando descuento", "Descuento:", "", (discount)=>{
            this.discount_send(line, discount);
        });
    }

    discount_send(line, discount){
        let obj = {};
        obj.id = line.id;
        obj.description = Constants.DISCOUNT_TEXT+discount+"% " + line.description;
        obj.price = parseFloat((line.price-(line.price * discount/100)).toFixed(2));
        obj.unitPrice = parseFloat((obj.price/line.quantity).toFixed(2));
        this.output.updateLines([obj]);
        this.refreshTicket();
    }


    treatLine(line) {
        let permission = this.askPermission(Constants.PERMISSION_TREAT, ()=>{
            this.treatLine(line);
        });
        if(!permission){
            return;
        }
        let obj = {};
        obj.id = line.id;
        if (line.free) {
            if(line.superline && line.superline.free){
                obj.price = 0
            } else{
                obj.price = line.unitPrice * line.quantity;
            }
            obj.description = line.description.substring(Constants.TREAT_TEXT.length);
        } else {
            obj.price = 0;
            obj.description = Constants.TREAT_TEXT+line.description;
        }
        obj.sublines = [];
        for(let subline of line.getSublines(true)){
            let sublineObj = {};
            sublineObj.id = subline.id;
            if (line.free && !subline.free) {
                sublineObj.price = subline.unitPrice * subline.quantity;
            } else {
                sublineObj.price = 0;
            }
            obj.sublines.push(sublineObj);
        }
        this.output.updateLines([obj]);
        this.refreshTicket();
    }


    deleteLine(line) {
        if(this.table.markedForPrinting && this.table.countProductLines()<=1){
            if(!line.isMenuComponent()&&!line.isKitchenNotice()){
                this.modalController.alert("Documento marcado", "No se puede borrar la línea porque el documento está marcado para impresión.");
                return;
            }
        }
        let deletePermission  = this.permissionManager.getPermission(Constants.PERMISSION_DELETE_LINE);
        let permissionType = Constants.PERMISSION_DELETE_LINE;
        //if(deletePermission.permitted&&!deletePermission.required){
        if(line.printed || this.table.markedForPrinting){
            permissionType = Constants.PERMISSION_DELETE_LINE_PRINTED;
        } else if(line.kitchen){
            permissionType = Constants.PERMISSION_DELETE_LINE_KITCHEN;
        }
        //}
        
        let permission = this.askPermission(permissionType, ()=>{
            this.deleteLine(line);
        });
        if(!permission){
            return;
        }
        if(!this.deleteLineConfirm){
            this.deleteLine_delete(line);
            return;
        }
        this.modalController.confirm("Borrando línea",
        "¿Estás seguro de querer borrar esta línea?<br><br><b>" + line.showDescription+"</b>",
        () => {
            this.deleteLine_delete(line);
        });
    }

    deleteLine_delete(line){
        this.output.deleteTicketLines([line.id]);
        this.refreshTicket();
    }

    calificators(line){
        this.navigator.navigateTo({
            type: Navigator.StateCalificator,
            calificators: line.calificators,
            obligatory: line.product.hasObligatoryCalificator(),
            defaultGroup: line.product.getDefaultGroup(),
            sendCallback: (calificators)=>{
                this.output.updateLines([{
                    id: line.id,
                    calificators: calificators
                }]);
                this.refreshTicket();
            }
        });
    }

    moveLine(line){
        if((this.table.printed || this.table.markedForPrinting) && this.table.countProductLines()<=1){
                this.modalController.alert("Documento impreso", "No se puede mover la línea porque el documento ya ha sido impreso o marcado para impresión.");
                return;
        }
        if(this.table.markedForPrinting){
            this.modalController.alert("Marcado para impresión", "No puedes realizar un traslado mientras el documento está marcado para impresión.");
            return;
        }
        let permission = this.askPermission(Constants.PERMISSION_MOVE_LINE, ()=>{
            this.moveLine();
        });
        if(!permission){
            return;
        }
        let superline = line.searchSuperline();
        let selections = [{
            line: superline,
            selectedQuantity: superline.quantity,
        }];
        this.navigator.navigateTo({
            type: Navigator.StatePlace,
            title: "Traspaso de líneas",
            tableCallback: (table)=>{
                return this.moveLines_tableCallback(selections, table);
            }
        });
    }

    moveLines(){
        let permission = this.askPermission(Constants.PERMISSION_MOVE_LINE, ()=>{
            this.moveLines();
        });
        if(!permission){
            return;
        }
        let defaultSelections = this.ml_getLines();
        this.navigator.navigateTo({
            type: Navigator.StateDemand,
            lines: defaultSelections,
            title: "Traspaso de líneas",
            sendCallback: (selections)=>{
                this.moveLines_linesSelected(selections, defaultSelections);
            }
        });
    }

    moveLines_linesSelected(selections, defaultSelections){
        if(defaultSelections.length==selections.length){
            let every = selections.every((selection)=>{
                return selection.selectedQuantity == selection.quantity;
            });
            if(every){
                this.moveTable();
                return;
            }
        }
        this.navigator.navigateTo({
            type: Navigator.StatePlace,
            title: "Traspaso de líneas",
            tableCallback: (table)=>{
                return this.moveLines_tableCallback(selections, table);
            }
        });
    }

    moveLines_tableCallback(selections, table){
        this.output.moveLines(selections, table);
        this.refreshTicket();
        this.navigator.goBack();
        return true;
    }

    ml_getLines(){
        this.demandLinesCreator.setLines(this.table.getLines(true));
        this.demandLinesCreator.filter((line)=>{
            let valid = true;
            valid = valid && !line.isKitchenNotice();
            valid = valid && !line.isMenuComponent();
            valid = valid && !line.isFastFoodIngredient();
            return valid;
        });
        this.demandLinesCreator.setDivisibleCallback((line)=>{
            let divisible = true;
            divisible = divisible && !line.isMenu();
            divisible = divisible && !line.isFastFood();
            return divisible; 
        });
        return this.demandLinesCreator.getDemandLines();
    }
    
    moveTable(){
        if(this.table.markedForPrinting){
            this.modalController.alert("Marcado para impresión", "No puedes realizar un traslado mientras el documento está marcado para impresión.");
            return;
        }
        let permission = this.askPermission(Constants.PERMISSION_MOVE_LINE, ()=>{
            this.moveTable();
        });
        if(!permission){
            return;
        }
        this.navigator.navigateTo({
            type: Navigator.StatePlace,
            title: "Traspaso de mesa",
            tableCallback: (table)=>{
                this.move_moveTable(table);
                return false;
            },
            unblockCallback: (table, response)=>{
                this.move_unblock(table, response);
            }
        });
    }

    move_moveTable(table){
        if(!this.table.kitchen){
            this.output.moveTicket(this.table, table, false);
            return;
        }   
        this.modalController.yesOrNo(
            "Traspasando mesa",
            "¿Quieres notificar el traspaso en cocina?",
            (flag)=>{
                this.output.moveTicket(this.table, table, flag);
            }
        );
    }

    move_unblock(status){
        switch(status){
            case 0:
                this.modalController.alert("Traslado completado", "Se ha realizado el traslado.");
                this.refreshTicket();
                this.navigator.goBack();
                break;
            case 1:
                this.modalController.alert("Traslado no realizado", "No ha sido posible realizar el traslado porque ambas tienen un pedido abierto.");
                break;
            case 2:
                this.modalController.alert("Traslado no realizado", "No ha sido posible realizar el traslado porque ambas tienen un documento abierto.");
                break;
        }
    }

    /*move_changePrices(lines, oldTable, newTable){
        if(oldTable.place.priceId == newTable.place.priceId){
            return lines;
        }
        for(let line of lines){
            this.move_changePrice(line, oldTable, newTable)
        }
    }

    move_changePrice(line, oldTable, newTable){
        if(line.unitPrice != line.product.getPrice(oldTable.place.priceId)){
            line.setUnitPrice(line.product.getPrice(newTable.place.priceId));
        }
    }*/
    

    deleteAll() {
        if(this.table.markedForPrinting){
            this.modalController.alert("Documento marcado", "No se puede borrar el documento porque está marcado para impresión.");
            return;
        }
        if(this.isEmpty()){return};
        let permission = this.askPermission(Constants.PERMISSION_DELETE_LINE, ()=>{
            this.deleteAll();
        });
        if(!permission){
            return;
        }
        this.modalController.confirm("Borrar documento", "¿Estás seguro de querer borrar este documento?", ()=>{
            this.deleteAll_delete();
        });
    }

    deleteAll_delete(){
        this.output.deleteTicket(this.table.id);
        this.refreshTicket();
    }

    refreshTicket() {
        this.output.getTable(this.table.id);
    }

    toKitchen(){
        if(this.isEmpty()){return};
        let allPrinted = true;
        for(let line of this.table.getLines()){
            if(!line.kitchen){
                allPrinted = false;
                break;
            }
            let sublines = line.getSublines(true);
            for(let subline of sublines){
                if(!subline.kitchen){
                    allPrinted = false;
                    break;
                }
            }
        }
        if(allPrinted){
            this.modalController.confirm(
                "Siguientes platos",
                "¿Estás seguro de querer reclamar los siguientes platos?",
                ()=>{
                    this.modalController.askGroup((groupId)=>{
                        let group = this.groups.get(groupId);
                        let desc = "SIGUIENTES PLATOS";
                        if(groupId!="0"){
                            desc+=" ("+group.desc+")";
                        }
                        this.output.insertKitchenNotices([{
                            productId: "",
                            description: desc,
                            group: groupId,
                            tableId: this.table.id
                        }]);
                        this.refreshTicket();
                    });
                }
            );
        } else{
            this.output.toKitchen(this.table.id);
            this.refreshTicket();
            this.modalController.alert("Pedido enviado", "Se ha enviado el pedido a cocina.");
        }
    }



    print(){
        if(this.isEmpty()){return;}
        if(this.printTicketConfirm){
            this.modalController.confirm(
                "Imprimiendo documento",
                "¿Estás seguro de querer imprimir este documento?",
                ()=>{
                    this.printTicket_print();
                }
            );
        } else{
            this.printTicket_print();
        }
    }

    resend(){
        if(!this.table.kitchen){
            this.modalController.alert(
                "Mesa no reenviada",
                "La mesa no está enviada a cocina"
            );
            return;
        }  
        this.output.insertPrintCommand(this.table.id, 3);
        this.modalController.alert(
            "Mesa reenviada",
            "La mesa ha sido reenviada a cocina."
        );
        this.refreshTicket();
    }

    printTicket_print(){
        if(GlobalParameters.AUTO_KITCHEN){
            this.output.toKitchen(this.table.id);
        }
        this.output.insertPrintCommand(this.table.id, 1);
        this.modalController.alert(
            "Mesa marcada",
            "La mesa ha sido marcada para impresión."
        );
        this.refreshTicket();
    }

    close(){
        if(this.isEmpty()){return;}
        this.navigator.navigateTo({
            type: Navigator.StateSaleClosing
        });
    }
    
    worldTouch(){
        this.exitState();
        this.navigator.unwindUntil((state)=>{
            return state.type == Navigator.StatePlace
        });
    }

    assignClient(){
        this.modalController.askTextInput("Buscando clientes", "", "", (searchToken)=>{
            this.navigator.navigateTo({
                type: Navigator.StateClient,
                search: searchToken,
                callback: (client)=>{
                    this.output.updateTableClient(this.table.id, client);
                }
            });
        });
    }

    hotel(){
       if(this.isEmpty()){return;}
       this.modalController.askIntegerInput(
           "Número de habitación",
           "",
           "",
           (roomId)=>{
               this.output.askHotelRoom(roomId);
           }
        );
    }

    isEmpty(){
        if (this.table.getLines().length == 0) {
            this.modalController.alert(
                "Mesa vacía",
                "La mesa está vacía."
            );
            return true;
        }
        return false;
    }

    resetPrices(){
        this.modalController.confirm(
            "Restaurar precios",
            "¿Quiere restaurar los precios a su valor original?",
            ()=>{
                let lines = [];
                for(let line of this.table.lines.values()){
                    this.resetLinePrice(line, lines);
                }
                this.output.updateLines(lines);
                this.refreshTicket();
            }
        );
    }

    resetLinePrice(line, lines){
        if(line.isMenuComponent()){
            return;
        }
        if(line.isFastFoodIngredient()&&line.unitPrice==0){
            return;
        }
        let obj = {};
        obj.id = line.id;
        obj.unitPrice = line.unitPrice;
        obj.price = line.price;
        let newPrice = line.product.getPrice(this.table.place.priceId);
        if(newPrice>0){
            obj.unitPrice = newPrice;
        }
        if(!line.free){
            obj.price = parseFloat((obj.unitPrice * line.quantity).toFixed(2));
        }
        if(line.discount>0){
            obj.price = parseFloat((obj.price-(obj.price * line.discount/100)).toFixed(2));
            obj.unitPrice = parseFloat((obj.price/line.quantity).toFixed(2));
        }
        lines.push(obj);
        for(let subline of line.sublines.values()){
            this.resetLinePrice(subline, lines);
        }
    }

    askPermission(type, callback){
        return this.permissionManager.askPermission(type, callback);
    }

    exitState(){
        this.group = 0;
        if(GlobalParameters.AUTO_KITCHEN){
            this.output.toKitchen(this.table.id);
        }
        if(this.tableControl){
            this.output.closeTable(this.table);
        }
    }
}

export default TicketController;