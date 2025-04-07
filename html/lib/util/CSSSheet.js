class CSSSheet{

    constructor(sheet){
        this.sheet = sheet;
    }

    addRule(selector, rules){
        let str = selector + "{";
        for (const key of Object.keys(rules)){
            str += key + ":" + rules[key] + " !important;";
        }
        str += "}";
        this.sheet.insertRule(str, 1);
    }
}

export default CSSSheet;