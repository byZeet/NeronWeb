import TicketLineView from "./TicketLineView.js";

const ticketPanelTemplate = document.getElementById("ticket-panel-template").innerHTML;

class TicketPanel{

    constructor(){
        this.dom = $(ticketPanelTemplate);
        this.ticketView = this.dom.find(".ticket");
        this.placeName = this.dom.find(".place-name");
        this.tableName = this.dom.find(".table-name");
        this.totalPrice = this.dom.find(".total-price");
        this.views = new Map();
    }

    setController(controller){
        this.controller = controller;
    }

    changeTable(table){

        this.removeLines();
        this.views.clear();

        if(this.table){
            this.table.getObservable().removeObserver(this);
        }
        table.getObservable().addObserver(this);
        
        this.table = table;

        this.placeName.text(table.place.name);
        this.tableName.text(table.description);
        //
        this.setTotal(table.total);
        let lines = table.getLines();
        //this.ticketView.html("");
        for(let line of lines){
            this.addLine(line);
        }
    }

    setTotal(total){
        this.totalPrice.text(total.toFixed(2));
    }

    addLine(line){
        let lineView = this.createLineView(line);
        this.ticketView.append(lineView.dom);
        for(let subline of line.getSublines()){
            lineView.addSubline(subline);
        }
    }

    removeLine(line){
        let lineView = this.views.get(line.id);
        lineView.destroy();
    }

    createLineView(line){
        let lineView = new TicketLineView(line, this);
        this.views.set(line.id, lineView);
        return lineView;
    }

    removeLines(){
        for(let lineView of this.views.values()){
            this.removeLine(lineView.getLine());
        }
    }

    //Events
    lineTouch(line){
        this.controller.lineTouch(line);
    }

}

export default TicketPanel;