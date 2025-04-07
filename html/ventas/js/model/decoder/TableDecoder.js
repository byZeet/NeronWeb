import TableModel from "../TableModel.js";
import ClientModel from "../ClientModel.js";
import TicketLineModel from "../ticket/TicketLineModel.js";
import Reserve from "../reserve/Reserve.js";

class TableDecoder{

    constructor(){
        this.tableMap = new Map();
    }

    setOperatorMap(map){
        this.operatorMap = map;
    }

    setPlaceMap(map){
        this.placeMap = map;
    }

    setProductMap(map){
        this.productMap = map;
    }

    setGroupMap(map){
        this.groupMap = map;
    }

    setCalificatorMap(map){
        this.calificatorMap = map;
    }

    decodeTables(tables){
        let tableModels = [];
        for(let table of tables){
            let tableModel = this.decodeTable(table);
            tableModels.push(tableModel);
        }
        return tableModels;
    }

    decodeTable(table){
        this.refreshTime = new Date();
        let place = this.placeMap.get(table.Pl);
        let tableModel = place.getTable(table.Id);
        if(tableModel==null){
            tableModel = this.createTable(table);
            place.addTable(tableModel);
            tableModel.setPlace(place);
            this.tableMap.set(tableModel.id, tableModel);
        } 
        this.updateTable(table, tableModel);
        return tableModel;
    }

    updateTable(table, tableModel){
        tableModel.printed = table.hasOwnProperty("Pri");
        tableModel.markedForPrinting = table.hasOwnProperty("MPri");
        tableModel.open = table.hasOwnProperty("Op");
        tableModel.setDinners(table.Din);
        tableModel.setKitchen(table.hasOwnProperty("K"));
        tableModel.setNotifications(table.No);
        if(table.hasOwnProperty("NR")){
            tableModel.setNextReserve(this.createReserve(table.NR));
        } else{
            tableModel.setNextReserve(null);
        }
        if(table.hasOwnProperty("Cl")){
            let client = new ClientModel(table.Cl);
            tableModel.setClient(client);
        } else{
            tableModel.setClient(null);
        }
        if(table.hasOwnProperty("Bl")){
            let operator = this.operatorMap.get(table.Bl);
            tableModel.setBlockOperator(operator);
        } else{
            tableModel.setBlockOperator(null);
        }
        for(let line of table.L){
            let lineModel = tableModel.getLine(line.I);
            if(lineModel==null){
                lineModel = this.createLine(line);
                tableModel.addLine(lineModel);
                lineModel.setTable(tableModel);
            }
            this.updateLine(line, lineModel);
        }
        tableModel.refresh(this.refreshTime);
    }

    createReserve(o){
        let reserve = new Reserve();
        reserve.setId(o.Id);
        reserve.setDate(new Date(o.D));
        reserve.setClientName(o.Na);
        reserve.setDiners(o.Di);
        return reserve;
    }

    createTable(table){
        let tableModel = new TableModel();
        tableModel.setId(table.Id);
        tableModel.setDescription(table.D);
        tableModel.order = table.O;
        return tableModel;
    }

    createLine(line){
        let lineModel = new TicketLineModel();
        lineModel.setId(line.I);
        if(line.hasOwnProperty("T")){
            lineModel.setType(line.T);
        } else{
            lineModel.setType("O");
        }
        let product = this.productMap.get(line.Pr);
        lineModel.setProduct(product);
        return lineModel;
    }

    updateLine(line, lineModel){
        lineModel.setRefreshTime(this.refreshTime);
        if(line.hasOwnProperty("Q")){
            lineModel.setQuantity(line.Q);
        } else{
            lineModel.setQuantity(1);
        }
        lineModel.setDescription(line.D);
        if(line.hasOwnProperty("AQ")){
            lineModel.setAskedQuantity(line.AQ);
        } else{
            lineModel.setAskedQuantity(0);
        }
        if(line.hasOwnProperty("U")){
            lineModel.setUnitPrice(line.U);
        } else{
            lineModel.setUnitPrice(0);
        }
        if(line.hasOwnProperty("P")){
            lineModel.setPrice(line.P);
        } else{
            lineModel.setPrice(0);
        }
        lineModel.setKitchen(line.hasOwnProperty("K"));
        lineModel.setPrinted(line.hasOwnProperty("Pri"));
        let groupId = line.hasOwnProperty("G")?line.G:"0";
        let group = this.groupMap.get(groupId);
        lineModel.setGroup(group);
        //Calificators
        let calificators = [];
        if(line.Ca){
            for(let calificatorId of line.Ca){
                let calificator = this.calificatorMap.get(calificatorId);
                if(calificator){
                    calificators.push(calificator);
                }
            }
        } 
        lineModel.setCalificators(calificators);

        //Sublines
        if(line.Su){
            for(let subline of line.Su){
                let sublineModel = lineModel.getSubline(subline.I);
                if(!sublineModel){
                    sublineModel = this.createLine(subline);
                    sublineModel.setTable(lineModel.table);
                    lineModel.addSubline(sublineModel);
                }
                this.updateLine(subline, sublineModel);
            }
        }
    }
}



export default TableDecoder;