
class LineEncoder{

    constructor(){
        
    }

    encodeLines(linesParam){
        let lines = [];
        for(let lineParam of linesParam){
            this.encodeLine(lines, lineParam);
        }
        return lines;
    }

    encodeLine(lines, line){
        let json = {};
        if(line.hasOwnProperty("id")){
            json.Id = line.id;
        }
        if(line.hasOwnProperty("productId")){
            json.Pr = line.productId;
        }
        if(line.hasOwnProperty("description")){
            json.D = line.description;
        }
        if(line.hasOwnProperty("quantity")){
            json.Q = line.quantity;
        }
        if(line.hasOwnProperty("unitPrice")){
            json.U= line.unitPrice;
        }
        if(line.hasOwnProperty("price")){
            json.P = line.price;
        }
        if(line.hasOwnProperty("group")){
            json.G = line.group;
        }
        if(line.hasOwnProperty("calificators")){
            json.Ca = [0,0,0,0,0];
            for(let i=0; i<line.calificators.length; i++){
               let calificator = line.calificators[i];
               json.Ca[i] = calificator.id; 
            }
        }
        if(line.hasOwnProperty("tableId")){
            json.Ta = line.tableId;
        }
        if(line.hasOwnProperty("type")){
            json.T = line.type;
        }
        if(line.hasOwnProperty("referenceId")){
            json.Re = line.referenceId;
        }
        lines.push(json);
        if(line.sublines){
            for(let subline of line.sublines){
                this.encodeLine(lines, subline);
            }
        }
    }
}

export default LineEncoder;