import Constants from "../../app/Constants.js";

import GP from "../../app/GlobalParameters.js";

const ticketLineViewTemplate = document.getElementById("ticket-line-view-template").innerHTML;

class TicketLineView{

    constructor(line, superview){
        this.sublineViews = [];
        this.superview = superview;
        this.line = line;
        line.getObservable().addObserver(this);

        this.dom = $(ticketLineViewTemplate);
        this.groupColorBand = this.dom.find(".ticket-line-color-band");
        this.productQuantity = this.dom.find(".product-quantity");
        this.productDescription = this.dom.find(".product-description");
        this.productPrice = this.dom.find(".product-price");

        this.freeIcon = $("<span>").addClass("ticket-icon free-ticket-icon hidden").text("I");
        this.fastFoodIcon = $("<span>").addClass("ticket-icon fast-food-ticket-icon hidden").text("F");
        this.menuIcon = $("<span>").addClass("ticket-icon menu-ticket-icon hidden").text("M");
        this.menuComponentIcon = $("<span>").addClass("ticket-icon menu-component-ticket-icon hidden").text("P");
        this.kitchenNoticeIcon = $("<span>").addClass("ticket-icon kitchen-notice-ticket-icon hidden").text("A");
        this.kitchenIcon = $("<span>").addClass("ticket-icon kitchen-ticket-icon hidden").text("C");
        this.discountIcon = $("<span>").addClass("ticket-discount-icon");
        this.productDescriptionWrapper = $("<span>").addClass("description-wrapper");

        this.productDescription.append(this.kitchenIcon);
        this.productDescription.append(this.menuIcon);
        this.productDescription.append(this.menuComponentIcon);
        this.productDescription.append(this.fastFoodIcon);
        this.productDescription.append(this.kitchenNoticeIcon);
        this.productDescription.append(this.freeIcon);
        this.productDescription.append(this.productDescriptionWrapper);
        this.productDescription.append(this.discountIcon);

        this.dom.click(()=>{
            superview.lineTouch(line);
        });

        this.setType(line.type);

        if(line.hasOwnProperty("group")){
            this.setGroup(line.group);
            this.setQuantity(line.quantity);
            this.setDescription(line.showDescription);
            this.setPrice(line.price);
            this.setDiscount(line.discount);
            this.setFree(line.free);
            this.setKitchen(line.kitchen);
        }
    }

    setCalificators(calificators){
        if(calificators.length<1){
            this.dom.removeClass("has-calificators");
        } else{
            this.dom.addClass("has-calificators");
        }
    }

    setGroup(group){
        this.groupColorBand.css({
            backgroundColor: "#"+group.color
        });
    }

    setQuantity(quantity){
        this.productQuantity.text(quantity);
    }

    setDescription(description){
        this.productDescriptionWrapper.text(description);
    }

    setPrice(price){
        if(price==0){
            this.productPrice.addClass("invisible");
        } else{
            this.productPrice.removeClass("invisible");
        }
        this.productPrice.text(price.toFixed(2));
    }

    setFree(free){
        if(free){
            this.freeIcon.removeClass("hidden");
        } else{
            this.freeIcon.addClass("hidden");
        }
    }

    setDiscount(discount){
        if(discount==0){
            this.discountIcon.addClass("hidden");
        } else{
            this.discountIcon.removeClass("hidden");
        }
        this.discountIcon.text(discount+"%");
    }

    setKitchen(kitchen){
        if(kitchen){
            this.kitchenIcon.removeClass("hidden");
        } else{
            this.kitchenIcon.addClass("hidden");
        }
    }

    setType(type){
        if(type == Constants.TYPE_FAST_FOOD_INGREDIENT
            && !GP.FF_INGREDIENTS_EDIT){
            this.productQuantity.addClass("invisible");
        } else if(type == Constants.TYPE_KITCHEN_NOTICE){
            this.kitchenNoticeIcon.removeClass("hidden");
            this.productQuantity.addClass("invisible");
            this.productPrice.addClass("invisible");
        } else if(type == Constants.TYPE_MENU){
            this.menuIcon.removeClass("hidden");
        } else if(type == Constants.TYPE_MENU_COMPONENT){
            this.menuComponentIcon.removeClass("hidden");
        } else if(type == Constants.TYPE_FAST_FOOD){
            this.fastFoodIcon.removeClass("hidden");
        }
    }

    getLine(){
        return this.line;
    }

    addSubline(line){
        let lineView = new TicketLineView(line, this.superview);
        let lastLineView = this.getLastSublineView();
        this.sublineViews.push(lineView);
        lastLineView.dom.after(lineView.dom);
        for(let subline of line.getSublines()){
            lineView.addSubline(subline);
        }
    }

    removeSubline(line){
        let lineView;
        let newViews = [];
        for(let view of this.sublineViews){
            if(view.getLine().id!=line.id){
                newViews.push(view);
            } else{
                lineView = view;
            }
        }
        this.sublineViews = newViews;
        lineView.destroy();
    }

    getLastSublineView(){
        if(this.sublineViews.length==0){
            return this;
        }
        let lineView = this.sublineViews[this.sublineViews.length-1];
        return lineView.getLastSublineView();
    }

    destroy(){
        for(let lineView of this.sublineViews){
            this.removeSubline(lineView.getLine());
        }
        this.dom.remove();
        this.line.getObservable().removeObserver(this);
    }

}

export default TicketLineView;