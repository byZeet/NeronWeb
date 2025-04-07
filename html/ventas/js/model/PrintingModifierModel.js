class PrintingModifierModel{

    constructor(modifier){
        this.id = modifier.Id;
        this.description = modifier.D.trim();
    }
}

export default PrintingModifierModel;