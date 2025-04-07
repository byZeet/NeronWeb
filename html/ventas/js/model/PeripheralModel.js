class PeripheralModel{

    constructor(peripheral){
        this.id = peripheral.Id;
        this.name = peripheral.Name.trim();
    }
}

export default PeripheralModel;