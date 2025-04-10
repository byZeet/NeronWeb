import ColorUtil from "../../../lib/util/ColorUtil.js";
import DateUtil from "../../../lib/util/DateUtil.js";
import GlobalParameters from "../app/GlobalParameters.js";
import Constants from "../app/Constants.js";
import Observable from "../../../lib/util/Observable.js";

class ProductModel{
    constructor(product){
        this.update(product);
        this.observable = new Observable();
    }

    init(){

    }
    
    update(product){
        this.id = product.I;
        this.description = product.D.trim();
        if(product.hasOwnProperty("S")){
            this.showDesc = product.S.trim();
        } else{
            this.showDesc = this.description;
        }
        this.prices = product.P;
        if(product.hasOwnProperty("P")){
            this.prices = product.P;
        } else{
            this.prices = new Array(10).fill(0);
        }
        this.type = product.hasOwnProperty("T")?product.T:"O";
        this.sellable = !product.hasOwnProperty("Se");
        this.askQuantity = product.hasOwnProperty("AskQ");
        this.askCalificators = product.hasOwnProperty("AskC");
        this.hasDayStock = product.hasOwnProperty("St");

        if(product.hasOwnProperty("OCal")){
            this.obligatoryCalificatorGroup = product.OCal; 
        } else{
            this.obligatoryCalificatorGroup = product.OCal; 
        }
        if(product.hasOwnProperty("DCal")){
            this.defaultCalificatorGroup = product.DCal; 
        } else{
            this.defaultCalificatorGroup = product.DCal; 
        }


        if(product.Bg){
            this.backgroundColor = ColorUtil.getColor(product.Bg);
        } else{
            this.backgroundColor = "e8ec4f";
        }
        if(product.C){
            this.textColor = ColorUtil.getColor(product.C);
        } else{
            this.textColor = "000000";
        }
        if(product.O){
            this.order = product.O;
        } else{ 
            this.order = 0;
        }
        this.combined = [];
        if(product.Im){
            this.image = product.Im;
        } else{
            this.image = null;
        }
        switch(this.type){
            case "F":
                this.basics = new Map();
                this.extras = new Map();
                break;
            case "M":
                this.menuLines = new Map();
                this.hasSupplement = product.hasOwnProperty("HasSup");
                break;
        }
    }

    setCurrentStock(stock){
        if(this.currentStock === stock){
            return;
        }
        this.currentStock = stock;
        this.observable.notify("onCurrentStockChanged", stock);
    }

    addCombined(combinedProduct){
        this.combined.push(combinedProduct);
        combinedProduct.firstProduct = this;
        combinedProduct.setFamily(this.family);
    }

    addBasic(id, basic){
        this.basics.set(id, basic);
    }

    addExtra(id, extra){
        this.extras.set(id, extra);
    }

    addMenuLine(group, product){
        let groupLines = this.menuLines.get(group);
        if(groupLines == null){
            groupLines = [];
            this.menuLines.set(group, groupLines);
        }
        groupLines.push(product);
    }

    isVisibleFastProduct(placeId, date){
        for(let fastLine of this.fastLines){
            if(fastLine.placeId != "T" && fastLine.placeId != placeId){
                continue;
            }
            if(!DateUtil.IsInTimeRange(date, fastLine.startTime, fastLine.endTime)){
                continue;
            }
            return true;
        }
        return false;
    }

    hasObligatoryCalificator(){
        return this.obligatoryCalificatorGroup>0;
    }

    getDefaultGroup(){
        if(this.hasObligatoryCalificator()){
            return this.obligatoryCalificatorGroup;
        } else{
            return this.defaultCalificatorGroup;
        }
    }

    setFamily(family){
        this.family = family;
    }

    getPrice(tariff){
        return GlobalParameters.Schedule.getPrice(tariff, this);
    }

    getSupplementPrice(){
        return this.prices[9]; 
    }

    isMenu(){
        return this.type === Constants.TYPE_MENU;
    }

    isFastFood(){
        return this.type === Constants.TYPE_FAST_FOOD;
    }

    isLiquor(){
        return this.type === Constants.TYPE_LIQUOR;
    }

    isSixTypes(){
        return this.type === Constants.TYPE_SIX_TYPES;
    }

    isWine(){
        return this.type === Constants.TYPE_WINE;
    }

    isTapa(){
        return this.type === Constants.TYPE_TAPA;
    }

    isKitchenNotice(){
        return this.type === Constants.TYPE_KITCHEN_NOTICE;
    }

    isCombined(){
        return this.type === Constants.TYPE_COMBINED;
    }

    hasCombined(){
        return this.isLiquor() ||
            this.isSixTypes() ||
            this.isTapa() ||
            this.isWine();
    }

    hasCustomizableDescription(){
        return this.description.toLowerCase() == "varios"
    }
}


export default ProductModel;