import Constants from "../app/Constants.js";
import Navigator from "../app/Navigator.js";

class FastFoodController{

    constructor(){
        this.selections = [];
        this.selections[Constants.FAST_FOOD_FULL] = new Map();
        this.selections[Constants.FAST_FOOD_FIRST_HALF] = new Map();
        this.selections[Constants.FAST_FOOD_SECOND_HALF] = new Map();

        this.ingredients = new Map();
        this.subgroups = null;
        
        this.reset();
    }

    setView(view){
        this.view = view;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setQuantity(quantity){
        this.quantity = quantity;
        this.currentItem = 0;
        this.view.setQuantity(quantity);
        this.view.setCurrentItem(1);
        for(let i=0; i<quantity; i++){
            this.items.push({
                full: true,
                calificators: this.calificators,
                selections: []
            });
        }
    }

    setGroup(group){
        this.subgroup = group;
        let extras = this.ingredients.values().filter(ingredient => ingredient.subgroupId == group.id);
        this.view.changeGroup(group, extras);
    }

    setLine(line){
        this.line = line;
    }

    setFastFood(fastFood){
        this.fastFood = fastFood;
        this.currentGroupIndex = 0;
        this.reset();
        for(let basic of Array.from(this.fastFood.basics.values()).filter(basic => basic.optional)){
            this.ingredients.set(basic.type+"@"+basic.product.id, basic);
            this.resetSelection(basic.type+"@"+basic.product.id, 1);
        }
        this.subgroups = new Set();
        for(let extra of this.fastFood.extras.values()){
            if(!extra.product){
                continue;
            }
            let subgroup = this.groups.get(extra.subgroupId);
            this.subgroups.add(subgroup);
            this.ingredients.set(extra.type+"@"+extra.product.id, extra);
            this.resetSelection(extra.type+"@"+extra.product.id, 0);
        }
        this.subgroups = Array.from(this.subgroups);
        this.subgroups.sort((a,b) => a.order - b.order);
        this.view.updateProduct(this.fastFood);
        this.full();
        this.view.setBasics(this.fastFood.basics);
        this.view.setSubgroups(this.subgroups);
        this.setGroup(this.subgroups[0]);
    }

    setGroups(groups){
        this.groups = groups;
    }

    setSendCallback(callback){
        this.sendCallback = callback;
    }

    setCalificators(calificators){
        this.calificators = calificators;
    }

    reset(){
        this.ingredients.clear();
        this.items = [];
        this.resetSelections();
    }

    resetSelections(){
        this.selections[Constants.FAST_FOOD_FULL].clear();
        this.selections[Constants.FAST_FOOD_FIRST_HALF].clear();
        this.selections[Constants.FAST_FOOD_SECOND_HALF].clear();
        for(let ingredient of this.ingredients.values()){
            let value;
            if(ingredient.type == Constants.INGREDIENT_TYPE_BASIC){
                value = 1;
            } else{
                value = 0;
            }
            this.resetSelection(ingredient.type+"@"+ingredient.product.id, value);
        }   
    }

    resetSelection(id, value){
        this.selections[Constants.FAST_FOOD_FULL].set(id, value);
        this.selections[Constants.FAST_FOOD_FIRST_HALF].set(id, value);
        this.selections[Constants.FAST_FOOD_SECOND_HALF].set(id, value);
    }

    setStartingSelections(selections){
        let full = true;
        for(let selection of selections){
            full = selection.part == Constants.FAST_FOOD_FULL;
            let value;
            let id = selection.type + "@" + selection.id;
            if(selection.type == Constants.INGREDIENT_TYPE_BASIC){
                value = selection.quantity;
            } else{
                value = full?selection.quantity:selection.quantity*2;
            }
            this.selections[selection.part].set(id, value);
        }
        if(full){
            this.full();
        } else{
            this.firstHalf();
        }
    }

    nextItem(){
        let item = this.items[this.currentItem];
        let full = this.part == Constants.FAST_FOOD_FULL;
        item.full = full;
        let selections = [];
        let firstSelections = [];
        let secondSelections = [];
        for(let ingredient of this.ingredients.values()){
            let id = ingredient.type+"@"+ingredient.product.id;
            if(full){
                let fullQuantity = this.selections[Constants.FAST_FOOD_FULL].get(id);
                selections.push({
                    ingredient: ingredient,
                    part: Constants.FAST_FOOD_FULL,
                    quantity: fullQuantity
                });
            } else{
                let firstQuantity = this.selections[Constants.FAST_FOOD_FIRST_HALF].get(id);
                let secondQuantity = this.selections[Constants.FAST_FOOD_SECOND_HALF].get(id);
                firstSelections.push({
                    ingredient: ingredient,
                    part: Constants.FAST_FOOD_FIRST_HALF,
                    quantity: firstQuantity
                });
                secondSelections.push({
                    ingredient: ingredient,
                    part: Constants.FAST_FOOD_SECOND_HALF,
                    quantity: secondQuantity
                });
            }
        }
        if(full){
            item.selections = selections;
        } else{
            item.selections = firstSelections.concat(secondSelections);
        }
        this.currentItem++;
        this.view.setCurrentItem(this.currentItem+1);
    }

    //Parts
    updatePart(){
        let selections = this.selections[this.part];
        for(let ingredient of this.ingredients.values()){
            let id = ingredient.type+"@"+ingredient.product.id;
            let view = this.view.views.get(id);
            let quantity = selections.get(id);
            let selected = quantity > 0;
            if(selected){
                view.select(quantity);
            } else{
                view.unselect();
            }
        }
    }
    

    full(){
        this.part = Constants.FAST_FOOD_FULL;
        this.view.full();
        this.updatePart();
    }

    firstHalf(){
        this.part = Constants.FAST_FOOD_FIRST_HALF;
        this.view.firstHalf();
        this.updatePart();
    }

    secondHalf(){
        this.part = Constants.FAST_FOOD_SECOND_HALF;
        this.view.secondHalf();
        this.updatePart();
    }

    canAdd(id, quantity){
        if(this.part!=Constants.FAST_FOOD_FULL){
            return true;
        }
        let currentQuantity = 0;
        for(let ingredient of this.ingredients.values()){
            let ingredientId = Constants.INGREDIENT_TYPE_EXTRA+"@"+ingredient.id;
            if(ingredientId==id){
                continue;
            }
            if(this.subgroup.id===ingredient.subgroupId){
                let selectionQuantity = this.selections[this.part].get(ingredientId);
                currentQuantity += selectionQuantity;
            }
        }
        if(this.subgroup.maxQuantity < currentQuantity+quantity){
            return false;
        }
        return true;
    }

    //Events
    productTouch(id){
        let ingredient = this.ingredients.get(id);
        let selection = this.selections[this.part].get(id);
        if(selection > 0){
            this.unselect(id);
        } else{
            if(ingredient.askQuantity){
                this.modalController.askIntegerInput("Cantidad", "", 1, (quantity)=>{
                    if(quantity > ingredient.maxQuantity){
                        quantity = ingredient.maxQuantity;
                    } 
                    this.select(id, quantity)
                });
            } else{
                this.select(id, 1);
            }
        }
    }

    nextGroup(){
        this.currentGroupIndex++;
        if (this.currentGroupIndex == this.subgroups.length) {
            this.currentGroupIndex = 0;
        }
        this.setGroup(this.subgroups[this.currentGroupIndex]);
    }

    previousGroup(){
        this.currentGroupIndex--;
        if (this.currentGroupIndex == -1) {
            this.currentGroupIndex = this.subgroups.length - 1;
        }
        this.setGroup(this.subgroups[this.currentGroupIndex]);
    }

    select(id, quantity){
        if(!this.canAdd(id, quantity)){
            this.modalController.alert("Cantidad máxima alcanzada", "Se ha alcanzado la cantidad máxima de "+ this.subgroup.maxQuantity + " extras");
            return;
        }
        this.selections[this.part].set(id, quantity);
        this.view.views.get(id).select(quantity);
    }

    unselect(id){
        this.selections[this.part].set(id, 0);
        this.view.views.get(id).unselect();
    }

    sendTouch(){
        this.nextItem();
        if(this.currentItem == this.quantity){
            this.navigator.goBack();
            this.sendCallback(this.items);
        } else{
            this.resetSelections();
            this.full();
        }
    }

    askCalificators(){
        let item = this.items[this.currentItem];
        this.navigator.navigateTo({
            type: Navigator.StateCalificator,
            calificators: item.calificators,
            obligatory: this.fastFood.hasObligatoryCalificator(),
            defaultGroup: this.fastFood.getDefaultGroup(),
            sendCallback: (calificators)=>{
                item.calificators = calificators;
            }
        });
    }

    goBack(){
        this.modalController.confirm(
            "Cancelando modificaciones", 
            "¿Estás seguro de querer cancelar las modificaciones?", 
            ()=>{
                this.navigator.goBack();
            }
        );
    }
}

export default FastFoodController;