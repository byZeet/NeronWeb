import Navigator from "../../app/Navigator.js"

class OpenTableController {

    constructor(){
        this.tableMap = new Map();
    }

    setApp(app){
        this.app = app;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setOperator(operator){
        this.operator = operator;
    }

    setLoginController(controller){
        this.loginController = controller;
    }

    setSchedule(schedule){
        this.schedule = schedule;
    }

    setPlaceController(controller){
        this.placeController = controller;
    }

    setOutput(output){
        this.output = output;
    }

    setCutleryProduct(cutleryProduct){
        this.cutleryProduct = cutleryProduct;
    }

    setTableControl(tableControl){
        this.tableControl = tableControl;
    }

    setTableMap(map){
        this.tableMap = map;
    }

    onTableOpen(tableId, status, blockOperator){
        let table = this.tableMap.get(tableId);
        if(!status){
            this.noPermission(table, blockOperator);
            return;
        }
        this.setTable(table);
        if(table.open){
            return;
        }
        this.askReserve(table);
    }


    openTable(table){
        if(this.tableControl){
            this.output.openTable(table);
            return;
        }
        if(table.open){
            this.setTable(table);
            return;
        }
        this.askReserve(table);
    }

    askReserve(table){
        if(!table.hasReserveSoon()){
            this.askDinners(table);
            return;
        }
        let reserve = table.nextReserve;
        this.modalController.yesOrNo(
            "Sentando reserva",
            "¿Quieres sentar la reserva de "+ reserve.clientName
            +" para las "+this.formatHour(reserve.date)+"?",
            (flag) => {
                if(flag){
                    this.output.seatReserve(reserve.id);
                    this.modalController.alert("Reserva sentada", "Se ha sentado la reserva.");
                    this.setDinners(table, reserve.diners);
                } else{
                    this.askDinners(table);
                }
            }
        );
    }

    askDinners(table){
        if(!table.place.askDinners){
            this.setDinners(table, 0);
            return;
        }
        this.modalController.askIntegerInput(
            "Introduciendo comensales",
            "Comensales:",
            "",
            (dinners) => {
                this.setDinners(table, dinners);
            },
            ()=>{
                this.setDinners(table, 0);
            }
        );
    }
    

    formatHour(datetime){
        return datetime.getHours()+":"
        +datetime.getMinutes().toString().padStart(2, '0');
    }

    setTable(table){
        this.app.changeTable(table);
        this.output.getTable(table.id);
        this.output.markNotification(table);
        this.navigator.navigateTo({
            type: Navigator.StateFamily,
            families: null
        });
    }

    setDinners(table, dinners){
        this.output.updateTableDinners(table.id, dinners);
        if(this.cutleryProduct && dinners>0){
            this.addCutleryProduct(table, dinners);
        }
        this.setTable(table);
    }

    tableCallback(table){
        this.openTable(table);
        return true;
    }

    
    switchState(){
        this.navigator.navigateTo({
            type: Navigator.StatePlace,
            title: "Elección de mesas",
            tableCallback: (table)=>{
                return this.tableCallback(table);
            },
            backCallback: ()=>{
                this.loginController.disconnect();
            }
        });
    }

    noPermission(table, blockOperator){
        this.modalController.alert(
            "Mesa bloqueada", 
            "La mesa "
            + table.description.toUpperCase()
            + " está bloqueada por el operador "
            + blockOperator.name.toUpperCase()
        );
    }

    addCutleryProduct(table, dinners){
        let unitPrice = this.cutleryProduct.getPrice(table.place.priceId);
        let line = {
            quantity: dinners,
            unitPrice: unitPrice,
            description: this.cutleryProduct.description,
            price: unitPrice*dinners,
            productId: this.cutleryProduct.id,
            tableId: table.id,
            group: 0,
            type: this.cutleryProduct.type,
            referenceId: 0,
            calificators: []
        }
        this.output.newLines([line]);
        this.output.getTable(table.id);
    }
}


export default OpenTableController;