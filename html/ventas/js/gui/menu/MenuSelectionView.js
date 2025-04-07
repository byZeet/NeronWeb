import Constants from "../../app/Constants.js";

const menuSelectionLineViewTemplate = document.getElementById("menu-selection-line-view-template").innerHTML;

class MenuSelectionView{

    constructor(controller, line){
        this.controller = controller;
        this.dom = $(menuSelectionLineViewTemplate);
        this.quantity = this.dom.find(".selection-quantity");
        this.calificators = this.dom.find(".selection-calificators");
        this.ingredients = this.dom.find(".selection-ingredients");
        this.quantity.text(line.quantity);
        let fastFoodSelections = line.fastFoodSelections;
        if(line.calificators.length==0){
            this.calificators.text("Sin calificadores").css("font-style", "italic");
        } else{
            this.calificators.text(line.calificators.map((calificator)=>calificator.description).join(", "));
        }
        if(fastFoodSelections){
            fastFoodSelections = fastFoodSelections.filter((s)=>{
                return (s.ingredient.isBasic()&&s.quantity==0)||(!s.ingredient.isBasic()&&s.quantity>0);
            });
            if(fastFoodSelections.length<=0){
                 this.ingredients.addClass("hidden");
            }
            for(let fastFoodSelection of fastFoodSelections){
                let typeString = fastFoodSelection.ingredient.type == Constants.INGREDIENT_TYPE_BASIC?"-":"+";
                let partString;
                if(fastFoodSelection.part == Constants.FAST_FOOD_FULL){
                    partString = "";
                } else if(fastFoodSelection.part == Constants.FAST_FOOD_FIRST_HALF){
                    partString = "1ª ";
                } else{
                    partString = "2ª ";
                }
                let quantityString = fastFoodSelection.quantity>1?"("+fastFoodSelection.quantity+") ":"";
                let typeSpan = $("<span>").addClass("type").text(typeString);
                let description = partString+quantityString+fastFoodSelection.ingredient.product.description;
                let descriptionSpan = $("<span>").addClass("description").text(description);
                let calificatorDom = $("<div>").addClass("selection-ingredient").append(typeSpan).append(descriptionSpan);
                this.ingredients.append(calificatorDom);
            }
        } else{
            this.ingredients.addClass("hidden");
        }
        this.dom.click(()=>{
            this.controller.lineTouch(line);
        });
    } 
}

export default MenuSelectionView;


