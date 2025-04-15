import GlobalParameters from "../../app/GlobalParameters.js";
import HTMLUtil from "../../../../lib/util/HTMLUtil.js";

const productView = HTMLUtil.createElementFromTemplateId("product-view-template");

class ProductView {

    constructor(controller, product) {
        const fallbackDesc = product.showDesc || product.description;
        // MOSTRAR POR CONSOLA TODOS LOS PRODUCTOS
        // console.log("🧪 Producto:", product.description, "| showDesc:", product.showDesc);  

        product.observable.addObserver(this);
        this.dom = productView.cloneNode(true);
        this.description = this.dom.querySelector(".product-description");
        this.description.appendChild(document.createTextNode(""));

        // Imagen
        if (product.image) {
            this.image = this.dom.querySelector(".product-image");
            this.dom.classList.add("with-image");
            this.image.addEventListener("error", () => {
                this.dom.classList.remove("with-image");
                this.dom.classList.add("without-image");
            });
            this.image.src = "/" + product.image;
        } else {
            this.dom.classList.add("without-image");
        }

        // Texto del producto
        if (!fallbackDesc || fallbackDesc.trim() === "") {
            this.dom.classList.add("without-text");
        } else {
            this.description.firstChild.nodeValue = fallbackDesc;
        }

        // Estilos
        this.dom.style.backgroundColor = "#" + product.backgroundColor;
        this.description.style.color = "#" + product.textColor;

        // Stock
        if (GlobalParameters.DAY_STOCK_CONTROL && product.hasDayStock) {
            this.stock = this.dom.querySelector(".product-stock");
            this.stock.appendChild(document.createTextNode(""));
            if (product.currentStock !== undefined) {
                this.stock.firstChild.nodeValue = product.currentStock;
            }
            this.dom.classList.add("has-stock");
        }

        // Evento de click
        this.dom.addEventListener("click", () => {
            controller.productTouch(product);
        });
    }

    setCurrentStock(currentStock) {
        if (!this.stock) return;
        this.stock.firstChild.nodeValue = currentStock;
    }

    onCurrentStockChanged(stock) {
        this.setCurrentStock(stock);
    }
}

export default ProductView;
