class MathUtil{

    static discreteDivision(number, count, decimals){
        let division = number/count;
        let factor = Math.pow(10, decimals);
        let roundedDivision = MathUtil.floor(division, 2);
        let decimalLeft = number - roundedDivision*count;
        let left = Math.round(decimalLeft*factor);
        let divisions = [];
        for(let i=0; i<count; i++){
            divisions[i] = roundedDivision;
            if(i<left){
                divisions[i] += 1/factor;
            }
        }
        return divisions;
    }

    static floor(number, decimals){
        let factor = Math.pow(10, decimals);
        return Math.floor(number * factor)/factor;
    }

}

export default MathUtil;