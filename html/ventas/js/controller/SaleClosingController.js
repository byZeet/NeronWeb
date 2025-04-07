import Navigator from "../app/Navigator.js";
import Constants from "../app/Constants.js";

import SaleClosingDinner from "./saleclosing/SaleClosingDinner.js";
import SaleClosingDinnerController from "./saleclosing/SaleClosingDinnerController.js";

import DemandLinesCreator from "./demand/DemandLinesCreator.js";

import MathUtil from "lib/util/MathUtil.js";
import GlobalParameters from "../app/GlobalParameters.js";

import CardReader from "./cardreader/CardReader.js";

class SaleClosingController{

    constructor(){
        this.documentTypes = new Map();
        this.paymentWay = [];
        this.price = [];
        this.dinnerController = new SaleClosingDinnerController();
        this.demandLinesCreator = new DemandLinesCreator();
        this.cardReader = new CardReader();

    }

    setNavigator(navigator){
        this.navigator = navigator;
        this.dinnerController.setNavigator(navigator);
    }

    setIsPinpad(isPinpad){
        this.isPinpad = isPinpad;
    }

    setPaymentWays(ways){
        this.paymentWays = ways;
        this.paymentWayMap = new Map();
        for(let way of ways){
            this.paymentWayMap.set(way.id, way);
        }
        this.dinnerController.setPaymentWays(this.paymentWayMap);
        Constants.CREDIT_PAYMENT_WAY = this.paymentWayMap.get("CRE");
    }

    setDocumentTypes(types){
        this.documentTypes.set("T", {
            id: "T",
            description: types[0]
        });
        this.documentTypes.set("F", {
            id: "F",
            description: types[1]
        });
        this.documentTypes.set("A", {
            id: "A",
            description: types[2]
        });
    }

    setPrintingModifiers(modifiers){
        this.modifiers = modifiers;
        this.modifierMap = new Map();
        for(let modifier of modifiers){
            this.modifierMap.set(modifier.id, modifier);
        }
        this.dinnerController.setModifiers(this.modifierMap);
    }

    setPeripherals(peripherals){
        this.peripherals = peripherals;
        this.peripheralMap = new Map();
        for(let peripheral of peripherals){
            this.peripheralMap.set(peripheral.id, peripheral);
        }
    }

    setModalController(controller){
        this.modalController = controller;
        this.dinnerController.setModalController(controller);
    }

    setSelectModal(modal){
        this.selectModal = modal;
        this.dinnerController.setSelectModal(modal);
    }

    setOutput(output){
        this.output = output;
    }

    setView(view){
        this.view = view;
        this.view.setDinnerController(this.dinnerController);
    }

    setHasRecever(flag){
        this.view.setHasRecever(flag)
    }

    setTable(table){
        if(this.table){
            this.table.getObservable().removeObserver(this);
        }
        table.getObservable().addObserver(this);
        this.table = table;
        this.setTotal(table.total)
        this.setDinners(table.dinners);
        this.setClient(table.client);
        this.setReceverQr("");
        this.setDiscount(0);
        this.setDocumentType(this.documentTypes.get(table.place.defaultDocType));
        this.setPaymentWay(this.paymentWays[0], 1);
        if(this.paymentWays.length>1){
            this.setPaymentWay(this.paymentWays[1], 2);
        } else{
            this.setPaymentWay(this.paymentWays[0], 2);
        }
        this.setTin(0); 
        this.setLineSelections(null);
        this.setModifier(null, 0);
        this.setPayments(1);
        this.setClients(null);
    }

    resetButtons(){
        let set = new Set();
        if(this.clients!=null || this.payments == 2){
            set.add("divide-dinners-button");
            set.add("two-payments-button");
            set.add("lines-button");
        }
        if(this.lineSelections!=null){
            set.add("divide-dinners-button");
            set.add("lines-button");
        }
        if(this.documentType.id == "A"){
            set.add("divide-dinners-button");
            set.add("two-payments-button");
        }
        let lines = this.table.getLines();
        if(lines.length==1&&lines[0].quantity==1){
            set.add("lines-button");
        }
        this.navigator.hideButtons(Array.from(set.values()));
    }

    reset(){
        this.setClients(null);
        this.setLineSelections(null);
    }

    setDinners(dinners){
        this.view.setDinners(dinners);
    }

    setReceverQr(qr){
        this.receverQr = qr;
        this.view.setReceverQr(qr);
    }

    setClient(client){
        this.client = client;
        if(client!=null && !client.id){
            this.cliente = null;
        }
        this.view.setClient(this.client);
    }

    setDiscount(discount){
        if(discount>100){
            discount=100;
        }
        this.discount = discount;
        this.view.setDiscount(discount);
    }

    setPaymentWay(paymentWay, slot){
        this.paymentWay[slot-1] = paymentWay;
        if(slot==1){
            this.view.setPaymentWay(paymentWay.description);
            this.view.setFirstPaymentWay(paymentWay.description);
        } else{
            this.view.setSecondPaymentWay(paymentWay.description);
        }
    }

    choosePaymentWay(paymentWay, slot){
        if(this.documentType.id=="A" 
            && Constants.CREDIT_PAYMENT_WAY
            && Constants.CREDIT_PAYMENT_WAY.id != paymentWay.id){
                this.alert_dn();
        }
        if(this.client == null && paymentWay.id == "CRE"){
            this.navigator.navigateTo({
                type: Navigator.StateClient,
                search: "",
                callback: (client)=>{
                    this.setClient(client);
                    this.setPaymentWay(paymentWay, slot);
                }
            });
            return;
        }
        this.setPaymentWay(paymentWay, slot);
    }

    alert_dn(){
        this.modalController.alert("Forma no permitida", 
            "El tipo de documento '"+this.documentType.description
            +"' requiere la forma de pago '"+ Constants.CREDIT_PAYMENT_WAY.description+"'");
            return;
    }

    setTotal(total){
        this.total = total;
        this.setPrice(total, 1);
        this.setPrice(0, 2);
        this.dinnerController.setTotal(total);
        this.view.setTotal(total);
    }


    setDocumentType(documentType){
        this.documentType = documentType;
        this.view.setDocumentType(documentType.description);
        this.resetButtons();
    }

    chooseDocumentType(documentType){
        if(documentType.id == "A" && Constants.CREDIT_PAYMENT_WAY){
            if(this.payments == 2){
                this.modalController.alert("Tipo no permitido", "No se puede seleccionar '"+documentType.description+"' y dos formas de pago.");
                return;
            }
            if(this.clients!=null){
                this.modalController.alert("Tipo no permitido", "No se puede seleccionar '"+documentType.description+"' en un documento dividido.");
                return;
            }
            this.setDeliveryNote(documentType);
            return;
        }
        this.setDocumentType(documentType);
    }

    setDeliveryNote(documentType){
        if(this.client == null){
            this.navigator.navigateTo({
                type: Navigator.StateClient,
                search: "",
                callback: (client)=>{
                    this.paymentWay 
                    this.setClient(client);
                    this.setPaymentWay(Constants.CREDIT_PAYMENT_WAY, 1);
                    this.setDocumentType(documentType);
                }
            });
            return;
        }
        this.setPaymentWay(Constants.CREDIT_PAYMENT_WAY, 1);
        this.setDocumentType(documentType);
    }

    setModifier(modifier, quantity){
        this.modifierSelection = {
            modifier: modifier,
            quantity: quantity
        }
        this.view.setModifier(modifier, quantity);
    }

    setTin(tin){
        this.tin = tin;
        this.view.setTin(tin);
    }

    paymentWayTouch(slot){
        let options = [];
        for(let paymentWay of this.paymentWays){
            options.push({
                id: paymentWay.id,
                description: paymentWay.description
            });
        }
        this.selectModal.setTitle("Seleccionando forma de pago");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((id)=>{
            let paymentWay = this.paymentWayMap.get(id);
            this.choosePaymentWay(paymentWay, slot);
        });
        this.selectModal.select(this.paymentWay[slot-1].id);
        this.selectModal.show();
    }

    documentTypeTouch(){
        let options = [];
        for(let documentType of this.documentTypes.values()){
            options.push({
                id: documentType.id,
                description: documentType.description
            });
        }
        this.selectModal.setTitle("Seleccionando tipo de documento");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((id)=>{
            let documentType = this.documentTypes.get(id);
            this.chooseDocumentType(documentType);
        });
        this.selectModal.select(this.documentType.id);
        this.selectModal.show();
    }

    dinnersTouch(){
        this.modalController.askIntegerInput(
            "Introduciendo comensales",
            "Comensales:",
            "",
            (dinners) => {
                this.output.updateTableDinners(this.table.id, dinners);
                this.output.getTable(this.table.id);
            }
        );
    }

    priceTouch(slot){
        this.modalController.askPriceInput(
            "Introduciendo importe",
            "Importe:",
            "",
            (price) => {
                this.setPrice(price, slot)
            }
        );
    }

    discountTouch(){
        this.modalController.askDoubleInput(
            "Introduciendo descuento",
            "Descuento:",
            "",
            (discount) => {
                this.setDiscount(discount);
            }
        );
    }

    tinTouch(){
        this.modalController.askPriceInput(
            "Introduciendo propina",
            "Propina:",
            "",
            (tin) => {
                this.setTin(tin);
            }
        );
    }
    
    receverQrTouch(){
        this.modalController.askIntegerTextInput(
            "QR Recever",
            "",
            "",
            (qr)=>{
                this.setReceverQr(qr);
            }
        )
        /*this.modalController.qrScanner((qr)=>{
            this.setReceverQr(qr);
        });*/
    }

    clientTouch(){
        let clientNeeded = false;
        if(this.payments==1){
            clientNeeded = this.client != null && this.paymentWay[0].id != "CRE"; 
        } else{
            clientNeeded = this.client != null && this.paymentWay[0].id != "CRE" && this.paymentWay[1].id != "CRE";
        }
        if(clientNeeded){
            this.modalController.confirm("Anulando cliente", "¿Estás seguro de querer anular este cliente?", ()=>{
                this.output.updateTableClient(this.table.id, {id: 0});
                this.output.getTable(this.table.id);
                this.setClient(null);
            });
            return;
        }
        this.navigator.navigateTo({
            type: Navigator.StateClient,
            search: "",
            callback: (client)=>{
                this.output.updateTableClient(this.table.id, client);
                this.output.getTable(this.table.id);
                this.setClient(client);
            }
        });
    }

    modifiersTouch(){
        let options = [{
            id: 0,
            description: "Sin modificador"
        }];
        for(let modifier of this.modifiers){
            options.push({
                id: modifier.id,
                description: modifier.description
            });
        }
        this.selectModal.setTitle("Seleccionando modificador");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((id)=>{
            if(id==0){
                this.setModifier(null, 0);
                return;
            }
            this.modalController.askIntegerInput(
                "Introduciendo cantidad",
                "Cantidad:",
                "",
                (quantity) => {
                    let modifier = this.modifierMap.get(id);
                    this.setModifier(modifier, quantity);
                }
            );
        });
        if(this.modifierSelection.modifier){
            this.selectModal.select(this.modifierSelection.modifier.id);
        } else{
            this.selectModal.select(0);
        }
        this.selectModal.show();
    }

    linesTouch(){
        this.navigator.navigateTo({
            type: Navigator.StateDemand,
            lines: this.lt_getLines(),
            title: "Selección de lineas",
            hiddenButtons: ["select-all-button"],
            emptyAllowed: true,
            sendCallback: (selections)=>{
               this.setLineSelections(selections);
            },
            checkErrorCallback: (selections)=>{
                return this.lt_checkError(selections);
             }
        });
    }

    lt_checkError(selections){
        let menus = new Map();
        let components = new Map();
        for(let selection of selections){
            let line = selection.line;
            if(line.type == Constants.TYPE_MENU){
                menus.set(selection.line.id, selection);
            }
            if(line.type == Constants.TYPE_MENU_COMPONENT){
                components.set(selection.line.id, selection);
            }
        }
        for(let selection of components.values()){
            let line = selection.line;
            if(!menus.has(line.superline.id)){
                this.modalController.alert("Selección inválida", "No se puede seleccionar un plato sin seleccionar su menú");
                return false;
            }
        }
        for(let selection of menus.values()){
            let line = selection.line;
            if(line.quantity<=1){
                continue;
            }
            if(selection.selectedQuantity<line.quantity){
                continue;
            }
            for(let subline of line.getSublines()){
                let sublineSel = components.get(subline.id);
                if(!sublineSel || sublineSel.selectedQuantity<subline.quantity){
                    this.modalController.alert("Selección inválida", "No se puede seleccionar todos los menús sin seleccionar todos los platos");
                    return false;
                }
            }
        }
        return true;
    }

    lt_getLines(){
        this.demandLinesCreator.setLines(this.table.getAllLines());
        this.demandLinesCreator.filter((line)=>{
            let valid = true;
            valid = valid && line.type != Constants.TYPE_KITCHEN_NOTICE;
            valid = valid && line.type != Constants.TYPE_FAST_FOOD_INGREDIENT;
            valid = valid && !(line.type == Constants.TYPE_MENU_COMPONENT && line.superline.quantity == 1);
            return valid;
        });
        this.demandLinesCreator.setMenuLinesCallback((line)=>{
            if(line.type != Constants.TYPE_MENU){
                return null;
            }
            if(line.quantity!=1){
                return null;
            }
            let sublines = line.getSublines();
            if(sublines.length <= 0){
                return null;
            }
            return sublines;
        });
        return this.demandLinesCreator.getDemandLines();
    }

    setPayments(payments){
        this.payments = payments;
        this.resetButtons();
        this.view.setPayments(this.payments);
        if(this.payments==2){
            this.setDiscount(0);
        }
    }

    setPrice(price, slot){
        if(price > this.total){
            price = this.total;
        }
        this.price[slot-1] = price;
        let left = this.total - price;
        this.price[1-(slot-1)] = left;
        if(slot==1){
            this.view.setFirstPrice(price);
            this.view.setSecondPrice(left);
        } else{
            this.view.setSecondPrice(price);
            this.view.setFirstPrice(left);
        }
    }   

    setLineSelections(selections){
        if(selections==null || selections.length == 0){
            this.lineSelections = null;
        } else{
            this.lineSelections = selections;
        }
        if(this.lineSelections==null){
            this.setTotal(this.table.total);
            this.view.setLineSelections(null);
            return;
        } 
        let allSelections = [];
        for(let selection of this.lineSelections){
            allSelections.push(selection);
            if(selection.menuLines){
                selection.menuLines.forEach((line)=>{
                    allSelections.push({
                        line: line,
                        selectedQuantity: line.quantity
                    });
                });
            }
        }
        this.lineSelections = allSelections;
        for(let selection of this.lineSelections){
            if(selection.line.free){
                selection.selectedPrice = 0;
                continue;
            }
            if(selection.line.quantity == selection.selectedQuantity){
                if(selection.line.product.type==Constants.TYPE_FAST_FOOD){
                    selection.selectedPrice = selection.line.getTotalPrice();
                    continue;
                }
                selection.selectedPrice = selection.line.price;
                continue;
            }
            let lineTotals = MathUtil.discreteDivision(selection.line.price, selection.line.quantity, 2);
            selection.selectedPrice = lineTotals.slice(0, selection.selectedQuantity).reduce((a, b)=>{
                return a+b;
            }, 0);
        }
        this.setTotal(this.lineSelections.reduce((a, b)=>{
            return a+b.selectedPrice;
        }, 0));
        this.resetButtons();
        this.view.setLineSelections(this.lineSelections);
        
    }

    togglePayments(){
        if(this.payments == 1){
            this.setPayments(2);
        } else{
            this.setPayments(1);
        }
    }

    divideDinners(){ 
        if(this.clients == null){
            this.modalController.askIntegerInput(
                "Introduciendo documentos",
                "Documentos:",
                "",
                (dinners) => {
                    this.divideDinners_divide(dinners);
                }
            );
        } else{
            this.modalController.confirm("Documento único", "¿Estás seguro de querer volver al modo de documento único?", ()=>{
                this.setClients(null);
            });
        }
    }

    divideDinners_divide(dinnerCount){
        if(dinnerCount<2){
            this.modalController.alert("Número no válido", "El número de documentos debe ser mayor que uno.");
            return;
        }
        this.resetLines();
        let clients = [];
        let totals = MathUtil.discreteDivision(this.total, dinnerCount, 2);
        for(let i=0; i<dinnerCount; i++){
            let dinner = new SaleClosingDinner();
            dinner.setClient(null);
            dinner.setTotal(totals[i]);
            dinner.setPaymentWay(this.paymentWays[0]);
            dinner.setModifierSelection({
                quantity: 0,
                modifier: null
            });
            clients.push(dinner);
        }
        this.setClients(clients);
        this.setDiscount(0);
    }

    setClients(clients){
        this.clients = clients;
        this.dinnerController.setDinners(clients);
        this.view.setClients(clients);
        this.resetButtons();
    }

    resetLines(){
        this.setLineSelections(null);
    }

    goBack(){
        this.setLineSelections(null);
        if(this.clients != null){
            this.modalController.confirm("Documento único", "¿Estás seguro de querer volver al modo de documento único?", ()=>{
                this.setClients(null);
            });
            return;
        } 
        if(this.payments==2){
            this.setPayments(1);
            return;
        }
        this.navigator.goBack();
    }

    send(){
        
        if(this.table.markedForPrinting){
            this.modalController.alert(
                "Mesa marcada",
                "La mesa aún tiene órdenes de impresión o cierre abiertas."
            );
            return;
        }

        if(this.documentType.id == "A"
            && Constants.CREDIT_PAYMENT_WAY
            && this.paymentWay[0].id != Constants.CREDIT_PAYMENT_WAY.id){
                this.alert_dn();
                return;
        }

        let clientNeeded = false;
        if(this.clients == null){
            if(this.payments==1){
                clientNeeded = this.client == null && this.paymentWay[0].id == "CRE"; 
            } else{
                clientNeeded = this.client == null && ( this.paymentWay[0].id == "CRE" || this.paymentWay[1].id == "CRE")
            }
        } else{
            clientNeeded = this.clients.some((dinner)=>{
                return dinner.client == null && dinner.paymentWay.id == "CRE";
            });
        }
        if(clientNeeded){
            this.modalController.alert(
                "Crédito sin cliente", 
                "Debe asignarse un cliente cuando la forma de pago es crédito."
            );
            return;
        }

        if(this.payments==2 && this.paymentWay[0] === this.paymentWay[1]){
            this.modalController.alert(
                "Formas de pago no válidas", 
                "En el modo de doble forma de pago, las dos formas de pago deben ser diferentes."
            );
            return;
        }

        /*this.modalController.confirm("Cerrando venta", "¿Estás seguro de querer cerrar la venta?", ()=>{
            //this.s_send();
            this.s_askCard();
        });*/
        this.s_askPeripheral();
    }

    s_askPeripheral(){

        this.peripheralId = 0;
        if(!this.hasCardPayment() || this.peripherals.length==0){
            this.modalController.confirm("Cerrando venta", "¿Estás seguro de querer cerrar la venta?", ()=>{
                this.s_askCard();
            });
            return;
        }
        if(this.peripherals.length==1){
            this.peripheralId = this.peripherals[0].id;
            this.modalController.confirm("Cerrando venta", "¿Estás seguro de querer cerrar la venta?", ()=>{
                this.s_askCard();
            });
            return;
        }
        let options = [];
        for(let peripheral of this.peripherals.values()){
            options.push({
                id: peripheral.id,
                description: peripheral.name
            });
        }
        this.selectModal.setTitle("Seleccionando dispositivo de pago");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((id)=>{
            this.peripheralId = id;
            let peripheral  = this.peripheralMap.get(id);
            this.modalController.confirm("Cerrando venta ("+peripheral.name+")", "¿Estás seguro de querer cerrar la venta en el dispositivo "+peripheral.name+ "?", ()=>{
                this.s_askCard();
            });
        });
        this.selectModal.show();
    }

    s_askCard(){
        if(!this.isPinpad){
            this.s_send();
            return;
        }
        let amount = 0;
        if(this.paymentWay[0] && this.paymentWay[0].id=="TAR"){
            amount = this.price[0];
        } else if(this.paymentWay[1] && this.paymentWay[1].id=="TAR"){
            amount = this.price[1];
        } 
        if(amount==0){
            this.s_send();
            return;
        }
        this.cardReader.read(amount, (response)=>{
            if(response==1){
                this.s_send();
            } else{
                this.modalController.alert("Transacción cancelada", "Se canceló la transacción.");
            }
        });
    }

    s_send(){
        let obj = {
            table: this.table,
            discount: this.discount,
            docType: this.documentType,
            client: this.client,
            receverQr: this.receverQr,
            tin: this.tin,
            peripheralId: this.peripheralId,
            modifier: {
                description: "",
                quantity: 0,
            }
        };
        let paymentWays;
        if(this.payments==1){
            obj.prices = [];
            paymentWays = [this.paymentWay[0]];
        } else{
            obj.prices = this.price,
            paymentWays = this.paymentWay;
        }
        obj.paymentWays = paymentWays.map((paymentWay)=>paymentWay.id);
        obj.lineSelections = this.lineSelections == null ? [] : this.lineSelections;
        obj.clients = this.clients == null ? [] : this.clients;

       

        if(this.modifierSelection.modifier != null){
            obj.modifier.quantity = this.modifierSelection.quantity,
            obj.modifier.description = this.modifierSelection.modifier.description
        }
        
        if(GlobalParameters.AUTO_KITCHEN){
            this.output.toKitchen(this.table.id);
        }
        
        this.output.closeSale(obj);
        this.navigator.unwindUntil((state)=>{
            return state.type == Navigator.StatePlace
        });

        this.modalController.alert(
            "Mesa marcada",
            "La mesa ha sido marcada para cierre."
        );
    }

    hasCardPayment(){
        if(this.clients != null){
            for(let client of this.clients){
                if(client.paymentWay.id=="TAR"){
                    return true;
                }
            }
            return false;
        }
        if(this.payments==1){
            if(this.paymentWay[0].id =="TAR"){
                return true;
            } else{
                return false;
            }
        }
        if(this.paymentWay[1].id=="TAR"){
            return true;
        }
        return false; 
    }
}

export default SaleClosingController;