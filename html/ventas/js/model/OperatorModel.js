class OperatorModel{
    constructor(operator){
        this.id = operator.Id;
        this.name = operator.Na;
        this.hasPassword = operator.hasOwnProperty("HasP");
        this.active = operator.hasOwnProperty("A");
        this.groupId = operator.G;
    }
}

export default OperatorModel;