import FamilyView from "./FamilyView.js";
import ProductView from "./ProductView.js";
import CombinedProductView from "./CombinedProductView.js";

import TicketInfoView from "./TicketInfoView.js";
import GlobalParameters from "../../app/GlobalParameters.js";

const orderPanelTemplate = document.getElementById("order-panel-template").innerHTML;

class OrderPanel{

    constructor(){
        this.dom = $(orderPanelTemplate);

        if(GlobalParameters.APPLE){
            this.dom.addClass("apple");
        }

        this.familyDom = this.dom.find(".family-panel");
        this.productDom = this.dom.find(".family-panel");

        this.ticketInfo = new TicketInfoView(this.dom.find(".ticket-info"));
        this.searchInput = null; // 🔹 Referencia al input de búsqueda

        this.noResults = $("<div>").addClass("no-results-message hidden"); // lo ocultamos por defecto
        this.productDom.after(this.noResults); // lo agregamos justo después del panel de productos


    } 

    setController(controller){
        this.controller = controller;
    }

    setBubblePanel(bubblePanel){
        this.bubblePanel = bubblePanel;
    }

    setTariff(tariff){
        this.tariff = tariff;
    }

    setFamilies(familyMap){
        this.familyViews = new Map();
        for(let family of familyMap.values()){
            let familyView = new FamilyView(this, family);
            this.familyViews.set(family.id, familyView);
        }
    }

    setProducts(productMap){
        this.productViews = new Map();
        for(let product of productMap.values()){
            let productView;
            if(product.isCombined()){
                productView = new CombinedProductView(this, product);
            } else{
                productView = new ProductView(this, product);
            }
            this.productViews.set(product.id, productView);
        }
    }

    updateFamilies(families){
        this.familyDom.children().detach();
        this.productDom.children().detach();
        for(let family of families){
            let view = this.familyViews.get(family.id);
            this.familyDom.append(view.dom);
        }
        this.ticketInfo.dom.get(0).scrollIntoView();
    }


    updateProducts(products) {
        this.productDom.children().detach();
    
        if (products.length === 0) {
            const texto = this.controller?.searchText ?? "";
            this.noResults
                .removeClass("hidden")
                .text(`Sin resultados para "${texto}"`);
        } else {
            this.noResults.addClass("hidden");
    
            for (let product of products) {
                if (product.sellable) {
                    let view = this.productViews.get(product.id);
                    this.productDom.append(view.dom);
                }
            }
        }
    
        this.ticketInfo.dom.get(0).scrollIntoView();
    }
    
    
    

    updateCombinedProducts(products){
        this.familyDom.children().detach();
        this.productDom.children().detach();
        for(let product of products){
            if(!product.sellable){
                continue;
            }
            if(GlobalParameters.SHOW_ZERO_COMBINED && (product.getPrice(this.tariff)==0)){
                continue;
            }
            let view = this.productViews.get(product.id);
            this.productDom.append(view.dom);
        }
        this.ticketInfo.dom.get(0).scrollIntoView();
    }

    changeTable(table){
        this.table = table;
        if(this.table){
            this.table.getObservable().removeObserver(this);
        }
        table.getObservable().addObserver(this);
        this.ticketInfo.changeTable(table);
    }


    //Updates
    setTotal(total){
        this.ticketInfo.setTotal(total);
    }

    addLine(line){
        this.ticketInfo.setLastLine(line);
    }

    removeLine(line){
        let lines = this.table.getLines();
        let length = lines.length;
        if(length>0){
            let lastLine = lines[length-1];
            this.ticketInfo.setLastLine(lastLine);
        } else{
            this.ticketInfo.setLastLine(null);
        }
    }

    //Events
    familyTouch(family){
        this.controller.familyTouch(family);
    }

    productTouch(product){
        this.controller.productTouch(product);
    }

    showBubble(quantity, product){
        let bubble = $("<div>").addClass("product-bubble").css({
            opacity:0, 
            top:"4.75em"
        });
        bubble.text(quantity + " X " + product.description);
        this.bubblePanel.append(bubble);
        bubble.animate(
            {
                opacity: 1
            }, 
            1000, 
            ()=>{
                setTimeout(
                    ()=>{
                        bubble.animate({
                            opacity: 0
                        }, 1000, ()=>{
                            bubble.remove();
                        });
                    },
                    500
                )
            }
        );
    }
    
    // 🔍 Agrega este método justo aquí:
    initSearchInput(controller) {
        this.searchInput = this.dom.find("#search"); // 🔹 Guardamos referencia
    
        if (this.searchInput.length === 0) {
            console.warn("❌ No se encontró el input de búsqueda.");
            return;
        }
    
        this.searchInput.on("input", () => {
            const value = this.searchInput.val().trim();
        
            if (value.length > 1) {
                window.app.isProductSearchActive = true;
                controller.searchText = value;
                controller.buscarProductos(value);
            } else {
                // 🔙 Si se borra el input, mostrar familias principales
                controller.showFamilies(); 
            }
        });
        
    
        this.searchInput.on("keydown", (e) => {
            if (e.key === "Enter") {
                const value = this.searchInput.val().trim();
                if (value.length > 1) {
                    window.app.isProductSearchActive = true;
                    controller.searchText = value;
                    controller.buscarProductos(value);
                    this.searchInput.val("");
        
                    // 🔻 Quitar foco tras pulsar Enter
                    this.searchInput.blur();
                }
            }
        });
        
    }
    
    clearSearchInput() {
        const input = this.dom.find("#search");
        if (input.length > 0) {
            input.val("");
            input.focus(); // opcional: dejar el foco si quieres
        }
    }

    toggleSearchInputVisibility() {
        if (!this.searchInput) {
            console.warn("❌ No se ha inicializado el input de búsqueda.");
            return;
        }
    
        this.searchInput.toggleClass("hidden");
    
        if (!this.searchInput.hasClass("hidden")) {
            this.searchInput.focus(); // opcional
        }
    }
    
        

}

export default OrderPanel;