import GlobalParameters from "../../app/GlobalParameters.js";
import HTMLUtil from "../../../../lib/util/HTMLUtil.js";

const productView = HTMLUtil.createElementFromTemplateId("product-view-template");

class ProductView{

    constructor(controller, product){
        product.observable.addObserver(this);
        this.dom = productView.cloneNode(true);
        this.description = this.dom.querySelector(".product-description");
        this.description.appendChild(document.createTextNode(""));
        if(product.image){
            this.image = this.dom.querySelector(".product-image");
            this.dom.classList.add("with-image");
            this.image.addEventListener("error", ()=>{
                this.dom.classList.remove("with-image");
                this.dom.classList.add("without-image");
            });
            this.image.src =  "/"+product.image;
        } else{
            this.dom.classList.add("without-image");
        }
        if(product.showDesc==""){
            this.dom.classList.add("without-text");
        } else{
            this.description.firstChild.nodeValue = product.showDesc;
        }
        this.dom.style.backgroundColor =  "#"+product.backgroundColor;
        this.description.style.color =  "#"+product.textColor;
        if(GlobalParameters.DAY_STOCK_CONTROL && product.hasDayStock){
            this.stock = this.dom.querySelector(".product-stock");
            this.stock.appendChild(document.createTextNode(""));
            if(product.currentStock!==undefined){
                this.stock.firstChild.nodeValue = product.currentStock;
            }
            this.dom.classList.add("has-stock");
        }
        /*if(GlobalParameters.TAG_PVP){
            this.pvp = this.dom.querySelector(".product-pvp");
            this.pvp.appendChild(document.createTextNode(""));
            if(product.prices[0]!==undefined){
                this.pvp.firstChild.nodeValue = product.prices[0];
            }
            this.dom.classList.add("has-pvp");
        }*/
        this.dom.addEventListener("click", ()=>{
            controller.productTouch(product);
        });
    }

    setCurrentStock(currentStock){
        if(!this.stock){
            return;
        }
        this.stock.firstChild.nodeValue = currentStock;
    }

    onCurrentStockChanged(stock){
        this.setCurrentStock(stock);
    }
}

export default ProductView;


