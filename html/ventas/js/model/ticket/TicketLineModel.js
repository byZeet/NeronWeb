import Constants from "../../app/Constants.js";
import Observable from "lib/util/Observable.js";


class TicketLineModel{

    constructor(){
        this.sublines = new Map(); 
        this.observable = new Observable();
        this.superline = null;
    }

    getObservable(){
        return this.observable;
    }

    setId(id){
        this.id = id;
    }

    setReferenceId(id){
        this.referenceId = id;
    }

    setType(type){
        this.type = type;
    }

    setQuantity(quantity){
        if(this.quantity==quantity){
            return;
        }
        this.quantity = quantity;
        this.observable.notify("setQuantity", quantity);
    }

    setAskedQuantity(askedQuantity){
        if(this.askedQuantity==askedQuantity){
            return;
        }
        this.askedQuantity = askedQuantity;
    }

    setUnitPrice(unit){
        this.unitPrice = unit;
    }

    setPrice(price){
        if(this.price === price){
            return;
        }
        this.price = price;
        this.observable.notify("setPrice", price);
    }

    setKitchen(kitchen){
        if(this.kitchen === kitchen){
            return;
        }
        this.kitchen = kitchen;
        this.observable.notify("setKitchen", kitchen);
    }

    setPrinted(printed){
        if(this.printed === printed){
            return;
        }
        this.printed = printed;
    }

    setProduct(product){
        this.product = product;
    }

    setDescription(description){
        if(this.description === description){
            return;
        }
        this.description = description;
        let showDescription = description;
        let free = false;
        if(showDescription.startsWith(Constants.TREAT_TEXT)){
            free = true;
            showDescription = showDescription.substring(Constants.TREAT_TEXT.length);
        }
        let discount = 0;
        if(showDescription.startsWith(Constants.DISCOUNT_TEXT)){
            let tempString = showDescription.substring(Constants.DISCOUNT_TEXT.length);
            let percentIndex = tempString.indexOf('% ');
            let discountSplit = tempString.substring(0, percentIndex);
            discount = parseFloat(discountSplit);
            showDescription = tempString.substring(percentIndex+2);
        }
        if(this.isMenuComponent() && showDescription.startsWith(Constants.MENU_COMPONENT_TEXT)){
            showDescription = showDescription.substring(Constants.MENU_COMPONENT_TEXT.length);
        }
        if(this.isFastFoodIngredient()){
            let extraType = showDescription.substring(0, 3);
            let half = showDescription.substring(4, 6);
            if(half != "1ª" && half != "2ª"){
                half = "";
            } else{
                half = half+" ";
            }
            let extraDescription;
            if(half == ""){
                extraDescription =  showDescription.substring(4, showDescription.length);
            } else{
                extraDescription =  showDescription.substring(7, showDescription.length);
            }
            showDescription = half+extraType + " "+ extraDescription;
            this.extraType = extraType == "CON"?Constants.INGREDIENT_TYPE_EXTRA:Constants.INGREDIENT_TYPE_BASIC;
            switch(half){
                case "1ª ":
                    this.extraHalf = Constants.FAST_FOOD_FIRST_HALF;
                    break; 
                case "2ª ":
                    this.extraHalf = Constants.FAST_FOOD_SECOND_HALF;
                    break;
                default:
                    this.extraHalf = Constants.FAST_FOOD_FULL;
            }
            let quantity = this.quantity*(this.extraHalf === Constants.FAST_FOOD_FULL?1:2);
            if(quantity>1){
                showDescription = "("+quantity+") "+showDescription;   
            }
        }
        this.setShowDescription(showDescription);
        this.setFree(free);
        this.setDiscount(discount);
    }

    setShowDescription(showDescription){
        if(this.showDescription === showDescription){
            return;
        }
        this.showDescription = showDescription;
        this.observable.notify("setDescription", this.showDescription);
    }

    setFree(free){
        if(this.free === free){
            return;
        }
        this.free = free;
        this.observable.notify("setFree", this.free);
    }

    setDiscount(discount){
        if(this.discount === discount){
            return;
        }
        this.discount = discount;
        this.observable.notify("setDiscount", this.discount);
    }

    setCalificators(calificators){
        this.calificators = calificators;
        this.observable.notify("setCalificators", calificators);
    }

    setGroup(group){
        if(this.group&&this.group.id==group.id){
            return;
        }
        this.group = group;
        this.observable.notify("setGroup", group);
    }

    setTable(table){
        this.table = table;
    }

    setSuperline(superline){
        this.superline = superline;
    }

    setRefreshTime(time){
        this.refreshTime = time;
    }

    getRefreshTime(){
        return this.refreshTime;
    }

    addSubline(line){
        line.setSuperline(this);
        this.sublines.set(line.id, line);
        this.observable.notify("addSubline", line);
    }

    removeSubline(subline){
        this.sublines.delete(subline.id);
        this.observable.notify("removeSubline", subline);
    }

    getSubline(id){
        return this.sublines.get(id);
    }

    refresh(time){
        this.total = this.price;
        for(let subline of this.getSublines()){
            if(subline.getRefreshTime()<time){
                this.removeSubline(subline);
                continue;
            }
            subline.refresh(time);
            this.total += subline.total;
        }
    }

    getTotalPrice(){
        let sublines = this.getSublines(true);
        let total = this.price;
        for(let subline of sublines){
            total+=subline.price;
        }
        return total;
    }

    getSublines(recursive=false){
        if(!recursive){
            return Array.from(this.sublines.values());
        }
        let sublines = [];
        for(let subline of this.sublines.values()){
            sublines.push(subline);
            let subsublines = subline.getSublines(true);
            for(let subsubline of subsublines){
                sublines.push(subsubline);
            }
        }
        return sublines;
    }

    getUnaskedQuantity(){
        return this.quantity - this.askedQuantity;
    }

 
    getRootLine(){
        if(this.superline){
            return this.superline.getRootLine();
        }
        return this;
    }

    searchSuperline(condition = null){
        let current = this;
        while(current.superline != null){
            if(condition != null && condition(current)){
                return current;
            }
            current = current.superline;
        }
        return current;
    }

    isMenu(){
        return this.type === Constants.TYPE_MENU;
    }

    isMenuComponent(){
        return this.type === Constants.TYPE_MENU_COMPONENT;
    }

    isFastFood(){
        return this.product && this.product.isFastFood();
    }

    isFastFoodIngredient(){
        return this.type === Constants.TYPE_FAST_FOOD_INGREDIENT;
    }

    isKitchenNotice(){
        return this.type === Constants.TYPE_KITCHEN_NOTICE;
    }

    isBasic(){
        return this.isFastFoodIngredient() && this.extraType === Constants.INGREDIENT_TYPE_BASIC;
    }

    isExtra(){
        return this.isFastFoodIngredient() && this.extraType === Constants.INGREDIENT_TYPE_EXTRA;
    }
}

export default TicketLineModel;