const tableViewTemplate = document.getElementById("table-view-template").innerHTML;
const tableView = $(tableViewTemplate);

const notificationTypes = new Map([
    [1, "has-order-notification"],
    [2, "has-call-notification"],
    [3, "has-ticket-notification"]
])
class TableView{

    constructor(controller, table){
        this.dom = tableView.clone();
        this.dom.find(".table-description").text(table.description);
        this.total = this.dom.find(".table-total");
        this.dinners = this.dom.find(".table-dinners");
        this.reserveTime = this.dom.find(".reserve-time");
        if(table.printed || table.markedForPrinting){
            this.dom.addClass("printed");
        } else if(table.open){
            this.dom.addClass("open");
        } else{
            this.dom.addClass("free");
            if(table.hasReserveSoon()){
                this.dom.addClass("has-reserve");
                this.reserveTime.text(table.nextReserve.getHour());
            }
        }
        if(table.dinners>0&&table.open){
            this.dom.addClass("show-dinners");
            this.dinners.text(table.dinners);
        } 
        if(table.hasNotifications()){
            this.dom.addClass("has-notification");
        }
        for(let key of table.notifications){
            let str = notificationTypes.get(key);
            this.dom.addClass(str);
        }

        

        this.total.text(table.total.toFixed(2));
        
        this.dom.click(()=>{
            controller.tableTouch(table);
        });

    } 



}

export default TableView;