import Constants from "../../app/Constants.js";

const demandLineTemplate = document.getElementById("demand-line-view-template").innerHTML;

class DemandLineView{
    constructor(controller, selection){
        this.controller = controller;
        this.dom = $(demandLineTemplate);

        this.quantity = this.dom.find(".line-quantity");
        this.selectedQuantity = this.dom.find(".line-selected-quantity");
        this.group = this.dom.find(".line-group");
        this.description = this.dom.find(".line-description");
        this.ingredients = this.dom.find(".line-ingredients");
        this.menuLines = this.dom.find(".line-menu-lines");
        this.calificators = this.dom.find(".line-calificators");

        let line = selection.line;

        this.dom.click(()=>{
            this.controller.lineTouch(line);
        });

        this.setGroup(line.group);
        this.setDescription(line.showDescription);
        this.setQuantity(selection.quantity);

        if(line.type == Constants.TYPE_FAST_FOOD){
            let sublines = line.getSublines();
            if(sublines.length>0){
                this.setIngredients(sublines);
            } else{
                this.ingredients.addClass("hidden");
            }
        } else{
            this.ingredients.addClass("hidden");
        }

        if(selection.menuLines){
            //let sublines = line.getSublines();
            this.setMenuLines(selection.menuLines);
        } else{
            this.menuLines.addClass("hidden");
        }

        if(line.calificators.length>0){
            this.setCalificators(line.calificators);
        } else{
            this.calificators.addClass("hidden");
        }

        this.setSelectedQuantity(selection.selectedQuantity);
    }

    setGroup(group){
        this.group.css({
            backgroundColor: "#"+group.color
        });
    }

    setDescription(description){
        this.description.text(description);
    }

    setQuantity(quantity){
        this.quantity.text(quantity);
    }

    setSelectedQuantity(quantity){
        this.selectedQuantity.text(quantity);
        if(quantity==0){
            this.selectedQuantity.addClass("invisible");
        } else{
            this.selectedQuantity.removeClass("invisible");
        }
    }

    setCalificators(calificators){
        this.calificators.text(calificators.map((calificator)=>calificator.description).join(", "));
    }

    setIngredients(lines){
        for(let line of lines){
            this.addIngredient(line);
        }
    }

    addIngredient(line){
        let typeString = line.extraType == Constants.INGREDIENT_TYPE_BASIC?"-":"+";
        let partString;
        if(line.extraHalf == Constants.FAST_FOOD_FULL){
            partString = "";
        } else if(line.extraHalf == Constants.FAST_FOOD_FIRST_HALF){
            partString = "1ª ";
        } else{
            partString = "2ª ";
        }
        let typeSpan = $("<span>").addClass("type").text(typeString);
        let description = partString+line.product.description;
        let descriptionSpan = $("<span>").addClass("description").text(description);
        let ingredientDom = $("<div>").addClass("line-ingredient").append(typeSpan).append(descriptionSpan);
        this.ingredients.append(ingredientDom);
    }

    setMenuLines(lines){
        for(let line of lines){
            this.addMenuLine(line);
        }
    }

    addMenuLine(line){
        let description = "("+line.quantity+") "+line.product.description;
        let descriptionSpan = $("<span>").addClass("description").text(description);
        let lineDom = $("<div>").addClass("line-menuLine").append(descriptionSpan);
        this.menuLines.append(lineDom);
    }
}

export default DemandLineView;