class Schedule{
    constructor(schedule){
        this.schedule = schedule;
    }

    getPrice(priceId, product){
        let date = new Date();
        let day = date.getDay();
        day = day==0?6:day-1;
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let minutesAdd = minutes<30?0:1;
        let pvpKey = this.schedule[day][hour*2+minutesAdd][priceId]-1;
        return product.prices[pvpKey];
    }
}

export default Schedule;