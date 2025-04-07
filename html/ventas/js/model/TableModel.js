import TicketLineModel from "./ticket/TicketLineModel.js";
import Constants from "../app/Constants.js";

import Observable from "lib/util/Observable.js";

class TableModel{
    constructor(){
        this.lines = new Map();
        this.observable = new Observable();
    }

    getObservable(){
        return this.observable;
    }

    setId(id){
        this.id = id;
    }

    setDescription(description){
        this.description = description;
    }

    setPrinted(printed){
        this.printed = printed;
    }

    setKitchen(kitchen){
        this.kitchen = kitchen;
    }

    setDinners(dinners){
        this.dinners = dinners;
        this.observable.notify("setDinners", dinners);
    }

    setPlace(place){
        this.place = place;
    }

    setClient(client){
        this.client = client;
        //this.observable.notify("setClient", client);
    }

    setBlockOperator(operator){
        this.blocked = operator?true:false;
        this.blockOperator = operator;
    }

    setNextReserve(nextReserve){
        this.nextReserve = nextReserve;
    }

    setNotifications(notifications){
        this.notifications = notifications;
    }

    hasNotifications(){
        return this.notifications.length>0;
    }

    hasReserveSoon(){
        if(!this.nextReserve){
            return false;
        }
        var now = new Date();
        var difference = this.nextReserve.date - now;
        var millisecondsInHour = 1000*60*60;
        var millisecondsInHalfHour = 1000*60*30;
        return difference > -millisecondsInHalfHour && difference < millisecondsInHour;
    }

    addLine(line){
        this.lines.set(line.id, line);
        this.observable.notify("addLine", line);
    }

    removeLine(line){
        this.lines.delete(line.id);
        this.observable.notify("removeLine", line);
    }

    refresh(time){
        let total = 0;
        for(let line of this.lines.values()){
            if(line.getRefreshTime()<time){
                this.removeLine(line);
                continue;
            }
            line.refresh(time);
            total += line.total;
        } 
        if(this.total === total){
            return;
        }
        this.total = total;
        this.observable.notify("setTotal", total);
    }

    getLine(id){
       return this.lines.get(id);
    }

    getLines(){
        return Array.from(this.lines.values());
    }

    getAllLines(){
        let baseLines = this.getLines();
        let all = [];
        baseLines.forEach((line)=>{
            all = all.concat([line].concat(line.getSublines(true)));
        });
        return all;
    }

    countProductLines(){
        let count = 0;
        for(let line of this.getLines()){
            if(line.type != Constants.TYPE_KITCHEN_NOTICE){
                count++;
            }
        }
        return count;
    }    
}

export default TableModel;