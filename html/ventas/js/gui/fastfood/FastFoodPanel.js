import ProductView from "./FastFoodProductView.js";
import FastFoodProductView from "./FastFoodProductView.js";
import Constants from "../../app/Constants.js";


const orderPanelTemplate = document.getElementById("fast-food-panel-template").innerHTML;

class FastFoodPanel{

    constructor(){
        this.dom = $(orderPanelTemplate);
        this.views = new Map();
        this.name = this.dom.find(".fast-food-name");
        this.header = this.dom.find(".fast-food-info");
        this.extrasDom = this.dom.find(".fast-food-extras");
        this.subgroupDom = this.dom.find(".extra-group-description");
        this.basicsDom = this.dom.find(".fast-food-basics");
        this.dom.find(".prev-button").click(()=>{
            this.controller.previousGroup();
        });
        this.dom.find(".next-button").click(()=>{
            this.controller.nextGroup();
        });
    } 

    setController(controller){
        this.controller = controller;
    }

    updateProduct(product){
        this.views.clear();
        this.name.text(product.showDesc);
        this.basicsDom.html("");
        for(let basic of Array.from(product.basics.values()).filter(basic => basic.optional)){
            let basicView = new FastFoodProductView(this.controller, basic.product, Constants.INGREDIENT_TYPE_BASIC);
            this.basicsDom.append(basicView.dom);
            this.views.set(Constants.INGREDIENT_TYPE_BASIC+"@"+basic.product.id, basicView);
        }
        this.extrasDom.html("");
        for(let extra of product.extras.values()){
            if(!extra.product){
                continue;
            }
            let extraView = new FastFoodProductView(this.controller, extra.product, Constants.INGREDIENT_TYPE_EXTRA);
            this.extrasDom.append(extraView.dom);
            this.views.set(Constants.INGREDIENT_TYPE_EXTRA+"@"+extra.product.id, extraView);
        }
        this.full();
    }

    changeGroup(group, extras){
        this.subgroupDom.text(group.desc);
        let views = [];
        for (let extra of extras){
            for(let [key, view] of this.views){
                if (key == Constants.INGREDIENT_TYPE_EXTRA+"@"+extra.product.id){
                    views.push(view);
                }
            }
        }
        this.extrasDom.children().detach();
        for(let view of views){
            this.extrasDom.append(view.dom);
        }
        this.dom.parent().scrollTop(0);
    }

    setBasics(basics){
        if (basics.size > 0){
            this.dom.removeClass("hide-basics");
        }else{
            this.dom.addClass("hide-basics");
        }
    }

    setSubgroups(subgroups){
        this.subgroups = subgroups;
        if (this.subgroups.length == 1){
            this.dom.addClass("one-subgroup");
        }else{
            this.dom.removeClass("one-subgroup");
        }
    }

    firstHalf(){
        this.dom.removeClass("full second-half").addClass("first-half");
    }

    secondHalf(){
        this.dom.removeClass("full first-half").addClass("second-half");
    }

    full(){
        this.dom.removeClass("first-half second-half").addClass("full");
    }

    setQuantity(quantity){
        if(quantity==1){
            this.header.addClass("hidden");
        } else{
            this.header.removeClass("hidden");
            this.header.find(".fast-food-current-item").text("0");
            this.header.find(".fast-food-quantity").text(quantity);
        }
    }

    setCurrentItem(currentItem){
        this.header.find(".fast-food-current-item").text(currentItem);
        this.dom.parent().scrollTop(0);
    }
    

}

export default FastFoodPanel;