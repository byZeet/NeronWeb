const defaultQuantityCallback = (line) => {
    return line.quantity;
}

const defaultSelectedQuantityCallback = (line) => {
    return 0;
}

const defaultDivisibleCallback = (line) => {
    return true;
}

const defaultMenuLinesCallback = (line) => {
    return null;
}

class DemandLinesCreator{

    setLines(lines){
        this.lines = lines;
        this.quantityCallback = defaultQuantityCallback;
        this.selectedQuantityCallback = defaultSelectedQuantityCallback;
        this.divisibleCallback = defaultDivisibleCallback;
        this.menuLinesCallback = defaultMenuLinesCallback;
    }

    filter(filter){
        this.lines = this.lines.filter(filter);
    }

    setQuantityCallback(mapFunction){
        this.quantityCallback = mapFunction;
    }

    setSelectedQuantityCallback(mapFunction){
        this.selectedQuantityCallback = mapFunction;
    }

    setDivisibleCallback(mapFunction){
        this.divisibleCallback = mapFunction;
    }

    setMenuLinesCallback(mapFunction){
        this.menuLinesCallback = mapFunction;
    }

    getDemandLines(){
        let demandLines = [];
        for(let line of this.lines){
            demandLines.push({
                line: line,
                quantity: this.quantityCallback(line),
                selectedQuantity: this.selectedQuantityCallback(line),
                divisible: this.divisibleCallback(line),
                menuLines: this.menuLinesCallback(line)
            });
        }
        return demandLines;
    }


}

export default DemandLinesCreator;