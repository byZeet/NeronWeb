import Navigator from "./Navigator.js";
import {LocalStorage} from "./Storage.js";

import GlobalParameters from "./GlobalParameters.js";

//Models
import OperatorModel from "../model/OperatorModel.js";
import PrintingModifierModel from "../model/PrintingModifierModel.js";
import PeripheralModel from "../model/PeripheralModel.js";
import Schedule from "../model/Schedule.js";

//Controllers
import LoginController from "../controller/LoginController.js";
import OperatorController from "../controller/OperatorController.js";
import PlaceController from "../controller/PlaceController.js";
import OrderController from "../controller/OrderController.js";
import TicketController from "../controller/TicketController.js";
import MenuController from "../controller/MenuController.js";
import FastFoodController from "../controller/FastFoodController.js";
import CalificatorController from "../controller/CalificatorController.js";
import ClientController from "../controller/ClientController.js";
import MenuSelectionController from "../controller/menu/MenuSelectionController.js";
import SaleClosingController from "../controller/SaleClosingController.js";

import OpenTableController from "../controller/place/OpenTableController.js";
import PermissionManager from "../controller/permission/PermissionManager.js";
import HotelTransferManager from "../controller/hotel/HotelTransferManager.js";

import ModalController from "../controller/ModalController.js";
import TicketLineModal from "../gui/modal/TicketLineModal.js";
import GroupModal from "../gui/modal/GroupModal.js";
import ButtonModal from "../gui/modal/ButtonModal.js";
import NumberInputModal from "../gui/modal/NumberInputModal.js";
import MenuSelectionModal from "../gui/modal/MenuSelectionModal.js";
import SelectModal from "../gui/modal/SelectModal.js";
import DemandController from "../controller/DemandController.js";

//Views
import RootPanel from "../gui/RootPanel.js";
import OperatorPanel from "../gui/operator/OperatorPanel.js";
import PlacePanel from "../gui/place/PlacePanel.js";
import OrderPanel from "../gui/family/OrderPanel.js";
import TicketPanel from "../gui/ticket/TicketPanel.js";
import MenuPanel from "../gui/menu/MenuPanel.js";
import FastFoodPanel from "../gui/fastfood/FastFoodPanel.js";
import CalificatorPanel from "../gui/calificator/CalificatorPanel.js";
import MenuSelectionPanel from "../gui/menu/MenuSelectionPanel.js";
import ClientPanel from "../gui/client/ClientPanel.js";
import DemandPanel from "../gui/demand/DemandPanel.js";
import SaleClosingPanel from "../gui/saleclosing/SaleClosingPanel.js";
import ButtonNav from "../gui/ButtonNav.js";

//Decoders
import FamilyTreeDecoder from "../model/decoder/FamilyTreeDecoder.js";
import TableDecoder from "../model/decoder/TableDecoder.js";
import CalificatorDecoder from "../model/decoder/CalificatorDecoder.js";
import PermissionDecoder from "../model/decoder/PermissionDecoder.js";
import MasterDecoder from "../model/decoder/MasterDecoder.js";
//
import WebSocketOutput from "../websocket/WebSocketOutput.js";
import WebSocketController from "../websocket/WebSocketController.js";
import WebSocketPingController from "../websocket/WebSocketPingController.js";
import Config from "../Config.js";



class App {
    launch(){
        this.retrieveConfig(()=>{
            this.init();
        });
    }

    retrieveConfig(callback){
        let queryParams = new URLSearchParams(window.location.search);
        let commanderId = queryParams.has("config")?queryParams.get("config"):"1";
        $.ajax({
            url: "./config/config_"+commanderId+".json",
            method: "GET",
            type: "JSON",
            success: (json) => {
                this.config = new Config(json);
                callback();
            }
        });
    }

    init(){
        this.commanderId = this.config.get("commander_id", "1");
        this.commanderName = this.config.get("commander_name", "Sin nombre");

        GlobalParameters.GRID_COLUMNS = this.config.get("grid_columns");

        let queryParams = new URLSearchParams(window.location.search);
        GlobalParameters.APPLE = queryParams.has("apple");
        this.operators = new Map();

        this.tableDecoder = new TableDecoder();
        this.familyTreeDecoder = new FamilyTreeDecoder();
        this.calificatorDecoder = new CalificatorDecoder();
        this.permissionDecoder = new PermissionDecoder();
        this.masterDecoder = new MasterDecoder();

        this.navigator = new Navigator();

        this.modalController = new ModalController();
        this.orderController = new OrderController();
        this.fastFoodController = new FastFoodController();
        this.calificatorController = new CalificatorController();
        this.ticketController = new TicketController();
        this.menuController = new MenuController();
        this.menuSelectionController = new MenuSelectionController();
        this.placeController = new PlaceController();
        this.operatorController = new OperatorController();
        this.loginController = new LoginController(this);
        this.clientController = new ClientController();
        this.demandController = new DemandController();
        this.saleClosingController = new SaleClosingController();

        this.openTableController = new OpenTableController();
        this.permissionManager = new PermissionManager();
        this.hotelTransferManager = new HotelTransferManager();

        let controllerMap = new Map([
           [Navigator.StateOperator, this.operatorController],
           [Navigator.StatePlace, this.placeController],
           [Navigator.StateFamily, this.orderController],
           [Navigator.StateProduct, this.orderController],
           [Navigator.StateCombinedProduct, this.orderController],
           [Navigator.StateTicket, this.ticketController],
           [Navigator.StateCalificator, this.calificatorController],
           [Navigator.StateFastFood, this.fastFoodController],
           [Navigator.StateMenu, this.menuController],
           [Navigator.StateMenuSelection, this.menuSelectionController],
           [Navigator.StateClient, this.clientController],
           [Navigator.StateDemand, this.demandController],
           [Navigator.StateSaleClosing, this.saleClosingController]
        ]);

        this.webSocketPingController = new WebSocketPingController(this);
        this.webSocketPingController.setPingInterval(this.config.get("ping_check_milliseconds", 1000));
        this.webSocketPingController.setMaxWaiting(this.config.get("ping_max_waiting", 2000));

        this.rootPanel = new RootPanel();
        this.buttons = new ButtonNav();
        this.operatorPanel = new OperatorPanel();
        this.placePanel = new PlacePanel();
        this.orderPanel = new OrderPanel();
        this.productsPanel = new OrderPanel();
        this.combinedPanel = new OrderPanel();
        this.ticketPanel = new TicketPanel();
        this.fastFoodPanel = new FastFoodPanel();
        this.calificatorPanel = new CalificatorPanel();
        this.menuPanel = new MenuPanel();
        this.menuSelectionPanel = new MenuSelectionPanel();
        this.clientPanel = new ClientPanel();
        this.demandPanel = new DemandPanel();
        this.saleClosingPanel = new SaleClosingPanel();

        let panelMap = new Map([
            [Navigator.StateOperator, this.operatorPanel],
            [Navigator.StatePlace, this.placePanel],
            [Navigator.StateFamily, this.orderPanel],
            [Navigator.StateProduct, this.orderPanel],
            [Navigator.StateCombinedProduct, this.orderPanel],
            [Navigator.StateTicket, this.ticketPanel],
            [Navigator.StateCalificator, this.calificatorPanel],
            [Navigator.StateFastFood, this.fastFoodPanel],
            [Navigator.StateMenu, this.menuPanel],
            [Navigator.StateMenuSelection, this.menuSelectionPanel],
            [Navigator.StateClient, this.clientPanel],
            [Navigator.StateDemand, this.demandPanel],
            [Navigator.StateSaleClosing, this.saleClosingPanel]
         ]);

        this.ticketLineModal = new TicketLineModal();
        this.groupModal = new GroupModal();
        this.buttonModal = new ButtonModal();
        this.numberInputModal = new NumberInputModal();
        this.menuSelectionModal = new MenuSelectionModal();
        this.selectModal = new SelectModal();

        this.navigator.setRootPanel(this.rootPanel);
        this.navigator.setControllerMap(controllerMap);
        this.navigator.setButtonNav(this.buttons);

        this.rootPanel.setPanelMap(panelMap);
        this.rootPanel.setButtonNav(this.buttons);

        this.orderPanel.setBubblePanel($("#root"));

        this.saleClosingPanel.hideTin(this.config.get("hide_tin", false));

        this.ticketLineModal.setTicketController(this.ticketController);
        this.ticketLineModal.setModalController(this.modalController);

        this.groupModal.setModalController(this.modalController);

        this.buttonModal.setModalController(this.modalController);

        this.numberInputModal.setModalController(this.modalController);
        this.selectModal.setModalController(this.modalController);

        this.operatorController.setView(this.operatorPanel);
        this.operatorController.setLoginController(this.loginController);

        this.placeController.setView(this.placePanel);
        this.placeController.setNavigator(this.navigator);
        this.placeController.setIgnorePlaces(this.config.get("ignore_places", []));

        this.orderController.setNavigator(this.navigator);
        this.orderController.setView(this.orderPanel);
        this.orderController.setModalController(this.modalController);
        this.orderController.setCommander(this.commanderId);
        this.orderController.setSelectModal(this.selectModal);
        this.orderController.setMenuController(this.menuController);

        this.ticketController.setView(this.ticketPanel);
        this.ticketController.setModalController(this.modalController);
        this.ticketController.setOrderController(this.orderController);
        this.ticketController.setNavigator(this.navigator);
        this.ticketController.setPrintTicketConfirm(this.config.get("print_ticket_confirm", false));
        this.ticketController.setDeleteLineConfirm(this.config.get("delete_line_confirm", true));
        this.ticketController.setPermissionManager(this.permissionManager);

        this.fastFoodController.setView(this.fastFoodPanel);
        this.fastFoodController.setModalController(this.modalController);
        this.fastFoodController.setNavigator(this.navigator);

        this.menuController.setView(this.menuPanel);
        this.menuController.setModalController(this.modalController);
        this.menuController.setMenuSelectionController(this.menuSelectionController);
        this.menuController.setNavigator(this.navigator);

        this.menuSelectionController.setView(this.menuSelectionPanel);
        this.menuSelectionController.setMenuController(this.menuController);
        this.menuSelectionController.setModalController(this.modalController);
        this.menuSelectionController.setMenuSelectionModal(this.menuSelectionModal);
        this.menuSelectionController.setNavigator(this.navigator);

        this.clientController.setView(this.clientPanel);
        this.clientController.setModalController(this.modalController);
        this.clientController.setNavigator(this.navigator);

        this.demandController.setView(this.demandPanel);
        this.demandController.setModalController(this.modalController);
        this.demandController.setNavigator(this.navigator);

        this.saleClosingController.setView(this.saleClosingPanel);
        this.saleClosingController.setModalController(this.modalController);
        this.saleClosingController.setSelectModal(this.selectModal);
        this.saleClosingController.setNavigator(this.navigator);
        this.saleClosingController.setIsPinpad(this.config.get("is_pinpad", false));

        this.openTableController.setApp(this);
        this.openTableController.setPlaceController(this.placeController);
        this.openTableController.setLoginController(this.loginController);
        this.openTableController.setModalController(this.modalController);
        this.openTableController.setNavigator(this.navigator);

        this.permissionManager.setModalController(this.modalController);

        this.hotelTransferManager.setModalController(this.modalController);
        this.hotelTransferManager.setSelectModal(this.selectModal);

        this.buttons.setControllerMap(controllerMap);
        this.buttons.setLoginController(this.loginController);
        this.buttons.setModalController(this.modalController);
        this.buttons.setNavigator(this.navigator);
        this.buttons.setHideButtons(this.config.get("hide_buttons", {}));

        this.calificatorController.setModalController(this.modalController);
        this.calificatorController.setNavigator(this.navigator);
        this.calificatorController.setView(this.calificatorPanel);

        this.modalController.setTicketLineModal(this.ticketLineModal);
        this.modalController.setGroupModal(this.groupModal);
        this.modalController.setButtonModal(this.buttonModal);
        this.modalController.setNumberInputModal(this.numberInputModal);

        this.loginController.setModalController(this.modalController);
        this.loginController.setCommanderId(this.commanderId);

        this.calificatorDecoder.setCalificatorController(this.calificatorController);

        this.operator = null;
        this.table = null;
        this.isInitialized = false;

        this.initGridColumns();
        this.startWebSocket();
    }

    startWebSocket(){
        this.wsController = new WebSocketController(this);
        let hostname = window.location.hostname;
        let url = "ws://" + hostname + ":" + this.config.get("server_port");
        this.socket = new WebSocket(url);
        let output = new WebSocketOutput(this.socket);
        this.setOutput(output);
        this.socket.onopen = (event) => {

        };
        this.socket.onmessage = (event) => {
            this.wsController.acceptMessage(event.data);
        }
        this.socket.onerror = (event)=>{
            this.onConnectionClose();
        }
        this.socket.onclose = (event) =>{
            this.onConnectionClose();
        }
        window.onerror = null;
        this.webSocketPingController.start();
    }

    setWebsocket(socket){
        this.socket = socket;
    }

    setOutput(output) {
        this.output = output;
        this.operatorController.setOutput(output);
        this.orderController.setOutput(output);
        this.ticketController.setOutput(output);
        this.placeController.setOutput(output);
        this.loginController.setOutput(output);
        this.webSocketPingController.setOutput(output);
        this.calificatorController.setOutput(output);
        this.clientController.setOutput(output);
        this.saleClosingController.setOutput(output);
        this.openTableController.setOutput(output);
        this.permissionManager.setOutput(output);
        this.hotelTransferManager.setOutput(output);
    }

    initGridColumns(){
        let gridColumns = GlobalParameters.GRID_COLUMNS;
        let classes = gridColumns.map((str)=>{
            return "bk"+str;
        }).join(" ");
        this.operatorPanel.dom.addClass(classes);
        this.placePanel.placesDom.addClass(classes);
        this.placePanel.tablesDom.addClass(classes);
        this.orderPanel.familyDom.addClass(classes);
        this.orderPanel.productDom.addClass(classes);
        this.calificatorPanel.content.addClass(classes);
        this.menuPanel.content.addClass(classes);
        this.fastFoodPanel.basicsDom.addClass(classes);
        this.fastFoodPanel.extrasDom.addClass(classes);
    }


    onAddGroups(param) {
        let groups = this.masterDecoder.deserializeGroups(param);
        this.familyTreeDecoder.setGroupMap(groups);
        this.menuController.setGroupMap(groups);
        this.tableDecoder.setGroupMap(groups);
        this.ticketController.setGroups(groups);
        this.orderController.setGroups(groups);
        this.groupModal.setGroups(groups.values());
        this.fastFoodController.setGroups(groups);
    }

    onAddOperators(operators){
        for (let operator of operators) {
            let operatorModel = new OperatorModel(operator);
            let groupPermissions = this.groupPermissions.get(operatorModel.groupId);
            operatorModel.permissions = groupPermissions;
            this.operators.set(operatorModel.id, operatorModel);
        }
        
        this.tableDecoder.setOperatorMap(this.operators);
        this.isInitialized = true;

        this.navigator.navigateTo({
            type: Navigator.StateOperator,
            operators: this.operators
        });
    }

    onAddPlaces(param){
        let places = this.masterDecoder.deserializePlaces(param);
        this.placeController.setPlaceMap(places);
        this.tableDecoder.setPlaceMap(places);
    }

    onAddTables(tables){
        let tableModels = this.tableDecoder.decodeTables(tables);
        this.placeController.setTables(tableModels);
        this.openTableController.setTableMap(this.tableDecoder.tableMap);
    }

    onFamilyTree(familyTree){
        let ret = this.familyTreeDecoder.decodeFamilyTree(familyTree);
        this.tableDecoder.setProductMap(ret.productMap);
        this.masterDecoder.setProductMap(ret.productMap);
        this.orderController.setRootFamilies(ret.familyTree);
        this.orderController.setFamilyMap(ret.familyMap);
        this.orderController.setProductMap(ret.productMap);
        this.orderController.setFastProducts(ret.fastProducts);
        if(this.cutleryId){
            this.cutleryProduct = ret.productMap.get(this.cutleryId);
            this.openTableController.setCutleryProduct(this.cutleryProduct);
        } else{
            this.cutleryProduct = null;
        }
    }

    onAddPaymentWays(param) {
        let paymentWays = this.masterDecoder.deserializePaymentWays(param);
        this.saleClosingController.setPaymentWays(paymentWays);
    }

    onAddPrintingModifiers(modifiers){
        let modifierModels = [];
        for(let modifier of modifiers){
            modifierModels.push(new PrintingModifierModel(modifier));
        }
        this.saleClosingController.setPrintingModifiers(modifierModels);
    }

    onAddPeripherals(peripherals){
        let peripheralModels = [];
        for(let peripheral of peripherals){
            peripheralModels.push(new PeripheralModel(peripheral));
        }
        this.saleClosingController.setPeripherals(peripheralModels);
    }

    onAddPermissions(permissions){
        this.groupPermissions = this.permissionDecoder.decodeGroups(permissions);
        this.permissionManager.setGroupPermissions(this.groupPermissions);
    }

    onSchedule(schedule) {
        let scheduleModel = new Schedule(schedule);
        this.schedule = scheduleModel;
        this.openTableController.setSchedule(scheduleModel);
        GlobalParameters.Schedule = scheduleModel;
    }

    onAddClients(param){
        let clients = this.masterDecoder.deserializeClients(param);
        this.clientController.setClients(clients);
    }   

    onCalificators(groups) {
        let res = this.calificatorDecoder.decodeGroups(groups);
        this.tableDecoder.setCalificatorMap(res.calificatorMap);
    }

    onConnectionOpen(args){
        if(this.isInitialized){
            this.startConnection(args);
            return;
        } 
        this.rootPanel.setCommanderName(this.commanderName);
        this.rootPanel.empty();
        this.output.getCalificators();
        this.output.getPlaces();
        this.output.getGroups();
        this.output.getFamilyTree();
        this.output.getSchedule();
        this.output.getPaymentWays();
        this.output.getOperators();
        this.startConnection(args);
        this.initParams(args.Param);
    }

    startConnection(args){
        this.sessionId = LocalStorage.get("SessionId");
        if (args.SesId == this.sessionId) {
            let connectionToken = LocalStorage.get("ConnectionToken");
            if(connectionToken!=null){
                this.loginController.rememberOperator(connectionToken);
            }
        } else {
            this.sessionId = args.SesId;
            LocalStorage.set("SessionId", args.SesId);
            LocalStorage.remove("ConnectionToken");
        }
    }

    initParams(params){
        if(params.hasOwnProperty("CutId")){
            this.cutleryId = params.CutId;
        } else{
            this.cutleryId = null;
        }
        this.menuController.setMultiSelect(params.hasOwnProperty("MulSel"));
        if(params.hasOwnProperty("MulTar")){
            let persistent = params.hasOwnProperty("MulTarPers");
            let multiTariff = {
                persistent: persistent
            }
            this.orderController.setTariffs(params.TarNa);
            this.orderController.setMultiTariff(multiTariff);
        } else{
            this.buttons.hideButton(Navigator.StateFamily, "tariff-button");
        }

        GlobalParameters.AUTO_KITCHEN = params.hasOwnProperty("AutKit");
        
        let tableControl = params.hasOwnProperty("TabCon");
        this.openTableController.setTableControl(tableControl);
        this.orderController.setTableControl(tableControl);

        GlobalParameters.FF_INGREDIENTS_EDIT = params.hasOwnProperty("IngEdit");
        GlobalParameters.PLACE_TPV = params.hasOwnProperty("PlT");
        GlobalParameters.SHOW_ZERO_COMBINED = params.hasOwnProperty("SZC");
        GlobalParameters.DAY_STOCK_CONTROL = params.hasOwnProperty("StC");
        GlobalParameters.TAG_PVP = params.hasOwnProperty("TagPVP");
        
        GlobalParameters.HasRecever =  params.hasOwnProperty("HasRe");
        this.saleClosingController.setHasRecever(GlobalParameters.HasRecever);
        
        GlobalParameters.HasHotel =  params.hasOwnProperty("HasH");
        if(GlobalParameters.HasHotel){
            GlobalParameters.HotelCodes = params["HoCo"];
        } else{
            this.buttons.hideButton(Navigator.StateTicket, "hotel-button");
        }

        GlobalParameters.ChangePriceWhileMoving = params.hasOwnProperty("ChPr");
        if(!GlobalParameters.ChangePriceWhileMoving){
            this.buttons.hideButton(Navigator.StateTicket, "reset-price-button");
        }

        this.saleClosingController.setDocumentTypes([
            params.DocT,
            params.DocF,
            params.DocA
        ]);
    }

    onConnectionAccepted(response) {
        this.loginController.loginResponse(response);
    }

    setPermissions(permissions){
        this.permissions = permissions;
        this.permissionManager.setPermissions(permissions);
    }

    onPermissionResponse(response){
        if(response.Status==2){
            this.permissionManager.permissionDenied();
            return;
        }
        this.permissionManager.permissionGranted(response.T);
    }

    changeTable(table) {
        this.table = table;
        this.orderController.changeTable(table);
        this.ticketController.changeTable(table);
        this.saleClosingController.setTable(table);
    }

    changeOperator(id) {
        this.permissions.clear();
        this.operator = this.operators.get(id);
        this.rootPanel.setOperatorName(this.operator.name);
        this.openTableController.setOperator(this.operator);
        this.openTableController.switchState();
        this.permissionManager.setOperator(this.operator);
    }

    closeOperator(){
        this.operator = null;
        this.rootPanel.setOperatorName("");
        this.navigator.unwindUntil((state)=>{
            return state.type == Navigator.StateOperator;
        });
    }

    onTableOpen(args){
        let blockOperator = this.operators.get(args.Bl);
        this.openTableController.onTableOpen(
            args.Ta,
            args.St,
            blockOperator
        );
    }

    onProductStock(args){
        this.masterDecoder.deserializeProductStocks(args);
    }

    onPlaceNotifications(args){
        this.placeController.updatePlaceNotifications(args);
    }

    onHotelRoom(args){
        let room = null;
        if(args){
            room = this.masterDecoder.deserializeHotelRoom(args);
        }
        this.hotelTransferManager.transfer(this.table.id, room);
    }

    onTable(table){
        this.tableDecoder.decodeTable(table);
    }

    onTicketMoved(status){
        this.placeController.unblock(status);
    }

    onPong(){
        this.webSocketPingController.pongReceived();
    }
    
    onConnectionClose(){
        this.webSocketPingController.stop();
        this.socket.close();
        this.modalController.alert(
            "Conexión perdida", 
            "Se ha perdido la conexión con el servidor", 
            "Reconectar",
            ()=>{window.location.reload();}
        );
    }

}

export default App;