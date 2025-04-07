class HotelRoom{

    constructor(){
        this.names = new Map();
    }

    setId(id){
        this.id = id;
    }

    setOccupied(occupied){
        this.occupied = occupied;
    }

    addName(key, value){
        this.names.set(key, value);
    }
}

export default HotelRoom;