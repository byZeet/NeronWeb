class Reserve{

    setId(id){
        this.id = id;
    }

    setDate(date){
        this.date = date;
    }

    setClientName(clientName){
        this.clientName = clientName;
    }

    setDiners(diners){
        this.diners = diners;
    }

    getHour(){
        return this.date.getHours()+":"
        +this.date.getMinutes().toString().padStart(2, '0');
    }
}

export default Reserve;