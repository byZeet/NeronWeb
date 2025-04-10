import Constants from "../app/Constants.js";
import GlobalParameters from "../app/GlobalParameters.js";
import Navigator from "../app/Navigator.js";


class OrderController {

    constructor() {
        this.group = Constants.NO_GROUP;
        this.quantity = 1;
    }

    setModalController(controller) {
        this.modalController = controller;
    }

    setSelectModal(modal){
        this.selectModal = modal;
    }

    setNavigator(navigator) {
        this.navigator = navigator;
    }

    setRootFamilies(rootFamilies) {
        this.rootFamilies = rootFamilies;
    }

    setProductMap(productMap){
        this.view.setProducts(productMap);
    }

    setFamilyMap(familyMap){
        this.view.setFamilies(familyMap);
    }

    setCommander(commander) {
        this.commander = commander;
    }

    setFastProducts(fastProducts) {
        this.fastProducts = fastProducts;
    }

    setFastProductsFlag(fastProductsFlag) {
        this.fastProductsFlag = fastProductsFlag;
    }
    
    setTableControl(tableControl){
        this.tableControl = tableControl;
    }

    setTariffs(tariffs){
        this.tariffs = tariffs;
    }

    setMenuController(controller){
        this.menuController = controller;
    }

    showFamilies(families) {
        this.substate = Navigator.StateFamily;
        let showFamilies;
        if (families) {
            this.rootState = false;
            showFamilies = families;
        } else {
            this.rootState = true;
            showFamilies = this.rootFamilies;
        }
        let commander = this.commander;
        if(GlobalParameters.PLACE_TPV){
            commander = this.table.place.tpv;
        }
        let visibleFamilies = showFamilies.filter((family) => {
            return family.registerOrder.hasOwnProperty(commander);
        }).sort((family1, family2) => {
            let order1 = family1.registerOrder[commander];
            let order2 = family2.registerOrder[commander];
            return order1 < order2 ? -1 : 1;
        });
        this.view.updateFamilies(visibleFamilies);
    }

    showProducts(products) {
        this.substate = Navigator.StateProduct;
        this.view.updateProducts(products);
    }

    showCombinedProducts(combinedProducts) {
        this.substate = Navigator.StateCombinedProduct;
        this.view.updateCombinedProducts(combinedProducts);
    }

    setGroups(groups){
        this.groups = groups;
    }

    setGroup(group) {
        this.group = group;
    }

    setQuantity(quantity) {
        this.quantity = quantity;
    }

    setView(view) {
        this.view = view;
    
        // setTimeout(() => {
        //     const searchInput = document.getElementById("search");
        //     if (searchInput) {
        //         console.log("🧪 Input encontrado, conectando eventos...");
    
        //         // Enter
        //         searchInput.addEventListener("keydown", (e) => {
        //             if (e.key === "Enter") {
        //                 const searchText = searchInput.value.trim();
        //                 if (searchText.length > 1) {
        //                     console.log("🔎 [ENTER] Buscando producto:", searchText);
        //                     window.app.isProductSearchActive = true;
        //                     this.searchText = searchText;
        //                     this.buscarProductos(searchText);
        //                     searchInput.value = "";
        //                 }
        //             }
        //         });
    
        //         // En tiempo real
        //         searchInput.addEventListener("input", () => {
        //             const searchText = searchInput.value.trim();
        //             if (searchText.length > 1) {
        //                 console.log("🔍 [INPUT] Buscando producto:", searchText);
        //                 window.app.isProductSearchActive = true;
        //                 this.searchText = searchText;
        //                 this.buscarProductos(searchText);
        //             }
        //         });
        //     } else {
        //         console.warn("⚠️ No se encontró el input de búsqueda.");
        //     }
        // }, 300); // Delay para asegurar que el DOM ya esté
    }
    

    setMultiTariff(multiTariff){
        this.multiTariff = multiTariff;
    }

    setOutput(output) {
        this.output = output;
    
        this.output.onProductSearchResult = (products) => {
            console.log("✅ Recibí productos:", products); // <--- aquí ves si te llega del servidor
            this.navigator.navigateTo({
                type: Navigator.StateProduct,
                controller: this,
                products: products
            });
        };
    }
    
    
    

    changeTable(table) {
        this.table = table;
        this.view.changeTable(table);
        if(!this.multiTariff || !this.multiTariff.persistent){
            this.setTariff(parseInt(this.table.place.priceId));
        } else if(this.tariff === undefined){
            this.setTariff(1);
        }
    }

    getCurrentTable() {
        return this.table;
    }

    askTariff(){
        let options = [{
            id: 0,
            description: "Por defecto"
        }];
        this.tariffs.forEach((tariff, i)=>{
            options.push({
                id: i+1,
                description: tariff
            });
        });
        this.selectModal.setTitle("Seleccionando tarifa");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((tariff)=>{
            if(tariff == 0){
                this.setTariff(parseInt(this.table.place.priceId));
                return;
            }
            this.setTariff(tariff);

        });
        this.selectModal.select(this.tariff);
        this.selectModal.show();
    }

    setTariff(tariff){
        this.tariff = tariff;
        this.view.setTariff(tariff);
    }

    editDinners(){
        this.modalController.askIntegerInput(
            "Introduciendo comensales",
            "Comensales:",
            "",
            (dinners) => {
                this.output.updateTableDinners(this.table.id, dinners);
            }
        );
    }

    familyTouch(family){
        if (family.hasSubfamilies()) {
            this.navigator.navigateTo({
                type: Navigator.StateFamily,
                controller: this,
                families: family.subfamilies
            });
        } else {
            this.navigator.navigateTo({
                type: Navigator.StateProduct,
                controller: this,
                products: family.products
            });
        }
    }

    askQuantity() {
        this.modalController.askDoubleInput("Introduciendo cantidad", "Cantidad:", "", (quantity) => {
            this.setQuantity(quantity);
        });
    }

    productTouch(product) {
        if (product.hasCombined() && this.substate == Navigator.StateProduct) {
            this.navigator.navigateTo({
                type: Navigator.StateCombinedProduct,
                controller: this,
                products: product.combined
            });
            return;
        }
        let quantity = this.quantity;
        this.quantity = 1;
        let groupId = this.group;
        if(this.group == "0" && product.family.defaultGroup){
            groupId = product.family.defaultGroup.id;
        }
        let line = {
            quantity: quantity,
            productId: product.id,
            table: this.table,
            tableId: this.table.id,
            group: groupId,
            type: product.type,
            referenceId: 0,
            product: product
        }
        if (product.hasCustomizableDescription()) {
            this.pt_askDescription(line);
        } else {
            this.pt_setDescription(line, product.description);
        }
    }

    toFastProducts() {
        if (this.fastProductsFlag) {
            return;
        }
        this.substate = Navigator.StateProduct;
        let now = new Date();
        let visibleFastProducts = this.fastProducts.filter((product) => {
            return product.isVisibleFastProduct(this.table.place.id, now);
        });
        visibleFastProducts.sort((a,b)=>{
            let aOrder = a.order;
            let bOrder = b.order;
            if(aOrder>bOrder){
                return 1;
            }
            else if(aOrder<bOrder){
                return -1;
            }
            return 0;
        });
        this.navigator.navigateTo({
            type: Navigator.StateProduct,
            controller: this,
            products: visibleFastProducts,
            fastProducts: true
        });
    }

    toKitchenMessage() {
        let line = {
            quantity: 1,
            productId: "0015",
            table: this.table,
            tableId: this.table.id,
            group: "0",
            type: "I",
            price: 0,
            unitPrice: 0,
            referenceId: 0
        }
        this.modalController.askTextInput("Mensaje para cocina", "", '', (description) => {
            line.description = description;
            this.output.newLines([line]);
            this.output.toKitchen(this.table.id);
            this.output.getTable(this.table.id);
        });
    }

    pt_askDescription(line) {
        this.modalController.askTextInput("Introduciendo descripción", "", '', (description) => {
            this.pt_setDescription(line, description);
        });
    }

    pt_setDescription(line, description) {
        let product = line.product;
        line.description = description;
        if(product.isMenu() || product.askQuantity){
            this.pt_askQuantity(line);
        } else{
            this.pt_setQuantity(line, line.quantity);
        }
    }

    pt_askPrice(line) {
        this.modalController.askPriceInput("Introduciendo precio", "Precio:", "", (price) => {
            this.pt_setPrice(line, price);
        });
    }

    pt_setPrice(line, price){
        let product = line.product;
        line.unitPrice = price;
        if(product.askCalificators || product.hasObligatoryCalificator()){
            this.pt_askCalificators(line);
        } else if(product.isCombined() && product.firstProduct.askCalificators){
            this.pt_askCalificators(line);
        } else{
            this.pt_setCalificators(line, []);
        }
    }

    pt_addLine(line) {
        let product = line.product;
        line.price = line.quantity * line.unitPrice;
        if (product.isFastFood()) {
            this.navigator.navigateTo({
                type: Navigator.StateFastFood,
                product: product,
                quantity: Math.round(line.quantity),
                calificators: line.calificators,
                sendCallback: (items) => {
                    this.ff_new(items, line.product, line.unitPrice, this.group, this.table.id);
                }
            });
        } else if (product.isMenu()) {
            this.navigator.navigateTo({
                type: Navigator.StateMenu,
                product: product,
                quantity: Math.round(line.quantity),
                sendCallback: (selections) => {
                    this.menu_new(selections, line);
                }
            });
        } else {
            this.view.showBubble(line.quantity, product);
            this.output.newLines([line]);
            this.output.getTable(this.table.id);
            if(product.isCombined() && !this.fastProductsFlag){
                this.navigator.goBack();
            }
        }
    }

    pt_addKitchenNotice(line) {
        this.output.insertKitchenNotices([line]);
        this.output.getTable(this.table.id);
    }

    pt_askQuantity(line){
        this.modalController.askDoubleInput("Introduciendo cantidad", "Cantidad:", "", (quantity) => {
            this.pt_setQuantity(line, quantity);
        }); 
    }

    pt_setQuantity(line, quantity){
        let product = line.product;
        if (product.isFastFood() || product.isMenu()){
            quantity = Math.round(quantity);
        }
        if(quantity == 0){
            quantity = 1;
        }
        line.quantity = quantity;
        
        if(product.isKitchenNotice()){
            this.pt_setPrice(line, 0);
            return;
        }

        let price = line.product.getPrice(this.tariff);
        if (price == 0) {
            this.pt_askPrice(line);
        } else {
            this.pt_setPrice(line, price);
        }
    }

    pt_askCalificators(line){
        let product = line.product;
        this.navigator.navigateTo({
            type: Navigator.StateCalificator,
            calificators: [],
            obligatory: product.hasObligatoryCalificator(),
            defaultGroup: product.getDefaultGroup(),
            sendCallback: (calificators)=>{
                this.pt_setCalificators(line, calificators);
            }
        });
    }

    pt_setCalificators(line, calificators){
        line.calificators = calificators;
        this.pt_addLine(line);
    }

    ff_new(items, product, unitPrice){
        let lines = this.ff_newFastFoodLines(items, product, unitPrice, this.group, this.table.id, 0);
        this.output.newLines(lines);
        this.output.getTable(this.table.id);
    }

    /*ff_newLine(selection, unitPrice, group, tableId, ref){
        let ingredient = selection.ingredient;
        let product = ingredient.product;
        let quantity = selection.part == Constants.FAST_FOOD_FULL?1:0.5;
        let typeString = ingredient.type == Constants.INGREDIENT_TYPE_BASIC?"SIN ":"CON ";
        let partString;
        if(selection.part == Constants.FAST_FOOD_FULL){
            partString = "";
        } else if(selection.part == Constants.FAST_FOOD_FIRST_HALF){
            partString = "1ª ";
        } else{
            partString = "2ª ";
        }
        let description = typeString+partString+product.description;
        return {
            quantity: quantity, 
            productId: product.id, 
            description: description,
            unitPrice: unitPrice, 
            price: unitPrice*quantity,
            tableId: tableId,
            group: group,
            type: Constants.TYPE_FAST_FOOD_INGREDIENT,
            referenceId: ref
        }
    }*/

    ff_newLine(selection, unitPrice, price, group, tableId, ref){
        let ingredient = selection.ingredient;
        let product = ingredient.product;
        let quantity = selection.quantity*(selection.part == Constants.FAST_FOOD_FULL?1:0.5);
        let typeString = ingredient.type == Constants.INGREDIENT_TYPE_BASIC?"SIN ":"CON ";
        let partString;
        if(selection.part == Constants.FAST_FOOD_FULL){
            partString = "";
        } else if(selection.part == Constants.FAST_FOOD_FIRST_HALF){
            partString = "1ª ";
        } else{
            partString = "2ª ";
        }
        let description = typeString+partString+product.description;
        return {
            quantity: quantity, 
            productId: product.id, 
            description: description,
            unitPrice: unitPrice, 
            price: price,
            tableId: tableId,
            group: group,
            type: Constants.TYPE_FAST_FOOD_INGREDIENT,
            referenceId: ref
        }
    }

    ff_newFastFoodLines(items, product, unitPrice, group, tableId, ref){
        let lines = [];
        for(let item of items){
            let fastFoodLine = {
                quantity: 1, 
                productId: product.id, 
                description: product.description,
                unitPrice: unitPrice, 
                price: unitPrice,
                tableId: tableId,
                group: group,
                type: Constants.TYPE_FAST_FOOD,
                referenceId: ref,
                calificators: item.calificators,
                sublines: this.ff_newLines(item.selections, group, tableId, 0)
            }
            lines.push(fastFoodLine);
        }
        return lines;
    }

    /*ff_newLines(selections, group, tableId, ref){
        let lines = [];
        let freeTimes = null;
        let freeI = 0;
        for(let selection of selections){
            let ingredient = selection.ingredient;
            if(ingredient.type == Constants.INGREDIENT_TYPE_EXTRA && freeTimes === null){
                freeTimes = ingredient.freeTimes * 2;
            }  
            let unitPrice = 0;          
            if(ingredient.type == Constants.INGREDIENT_TYPE_EXTRA){
                if(!ingredient.free){
                    unitPrice = ingredient.product.getPrice(this.tariff);
                }
                if(unitPrice>0 && freeI<freeTimes){
                    unitPrice = 0;
                    freeI+=selection.part==Constants.FAST_FOOD_FULL?2:1;
                }
            }
            lines.push(this.ff_newLine(selection, unitPrice, group, tableId, ref));
        }
        return lines;
    }*/

    /*ff_newLines(selections, group, tableId, ref){
        let lines = [];
        let freeTimes = null;
        let freeI = 0;
        for(let selection of selections){
            let ingredient = selection.ingredient;
            if(ingredient.type == Constants.INGREDIENT_TYPE_BASIC){
                if(selection.quantity==0){
                    lines.push(this.ff_newLine(selection, 0, group, tableId, ref));
                }
            } else{
                if(freeTimes === null){
                    freeTimes = ingredient.freeTimes * 2;
                }  
                for(let i=0; i<selection.quantity; i++){
                    let unitPrice = 0; 
                    if(!ingredient.free){
                        unitPrice = ingredient.price;
                    }
                    if(unitPrice>0 && freeI<freeTimes){
                        unitPrice = 0;
                        freeI+=selection.part==Constants.FAST_FOOD_FULL?2:1;
                    }
                    lines.push(this.ff_newLine(selection, unitPrice, group, tableId, ref));
                }    
            }   
        }
        return lines;
    }*/

    ff_newLines(selections, group, tableId, ref){
        let lines = [];
        let freeTimes = null;
        for(let selection of selections){
            let ingredient = selection.ingredient;
            if(ingredient.type == Constants.INGREDIENT_TYPE_BASIC){
                if(selection.quantity==0){
                    lines.push(this.ff_newLine(selection, 0, 0, group, tableId, ref));
                }
            } else{
                let isFull = selection.part===Constants.FAST_FOOD_FULL;
                if(freeTimes === null){
                    freeTimes = ingredient.freeTimes * 2;
                }
                if(selection.quantity == 0){
                    continue;
                }  
                if(ingredient.free){
                    lines.push(this.ff_newLine(selection, 0, 0, group, tableId, ref));
                    continue;
                } 
                let fullQuantity = selection.quantity*(isFull?2:1);
                let freeQuantity = Math.max(0, freeTimes);
                let paidQuantity = Math.max(0, fullQuantity-freeQuantity);
                freeTimes -= Math.min(fullQuantity, freeQuantity);
                let price = ingredient.price * paidQuantity/2; 
                let unitPrice =  parseFloat((price/selection.quantity).toFixed(2)); 
                lines.push(this.ff_newLine(selection, unitPrice, price, group, tableId, ref));
            }   
        }
        return lines;
    }

    ff_edit(items, line){
        let item = items[0];
        let deleteIds = [];
        for(let subline of line.getSublines()){
            deleteIds.push(subline.id);
        }
        let group = line.group.id;
        let tableId = line.table.id;
        let ref =  line.id;
        this.output.updateLines([{
            id: line.id,
            calificators: item.calificators
        }]);
        this.output.deleteTicketLines(deleteIds);
        let lines = this.ff_newLines(item.selections, group, tableId, ref);
        this.output.newLines(lines);
        this.output.getTable(this.table.id);
    }

    menu_new(selections, line){
        let product = line.product;
        line.group = Constants.NO_GROUP;
        line.sublines = this.menu_newLines(selections, line.tableId, 0, product.hasSupplement);
        this.output.newLines([line]);
        this.output.getTable(this.table.id);
    }

    menu_newLines(selections, tableId, ref, hasSupplement){
        let lines = [];
        for(let selection of selections.values()){
            lines.push(this.menu_newLine(selection, tableId, ref, hasSupplement));
        }
        return lines;
    }

    menu_newLine(selection, tableId, ref, hasSupplement){
        let product = selection.product;
        let group = selection.group;
        let quantity = selection.quantity;
        let calificators = selection.calificators;
        let unitPrice = hasSupplement?product.prices[9]:0;
        let price = quantity*unitPrice;
        let sublines = [];
        if(product.isFastFood()){
            sublines = this.ff_newLines(selection.fastFoodSelections, group, tableId, 0);
        }
        return {
            quantity: quantity, 
            productId: product.id, 
            description: product.description,
            unitPrice: unitPrice, 
            price: price,
            tableId: tableId,
            group: group,
            calificators: calificators,
            type: Constants.TYPE_MENU_COMPONENT,
            referenceId: ref,
            sublines: sublines
        }
    }

    menu_edit(selections, line, startingSelections){
        let hasSupplement = line.product.hasSupplement;
        let tableId = line.table.id;
        let ref = line.id;
        let keys = new Set(Array.from(selections.keys()).concat(Array.from(startingSelections.keys())));
        let forDeleting = [];
        let forUpdating = [];
        let forInserting = [];

        for(let key of keys.values()){
            let selection = selections.get(key);
            let menuLine = startingSelections.get(key);
            if(!selection){
                forDeleting.push(menuLine.id);
                continue;
            }
            if(!menuLine){
                forInserting.push(this.menu_newLine(selection, tableId, ref, hasSupplement));
                continue;
            }
            if(!selection.edit){
                continue;
            }
            forUpdating.push({
                id: menuLine.id,
                quantity: selection.quantity,
                price: selection.quantity*menuLine.unitPrice,
                calificators: selection.calificators,
                group: selection.group
            });
            if(selection.product.isFastFood()){
                forDeleting = forDeleting.concat(menuLine.getSublines().map((line)=>line.id));
                forInserting = forInserting.concat(this.ff_newLines(selection.fastFoodSelections, selection.group, tableId, menuLine.id));
            }
        }

        if(forDeleting.length>0){
            this.output.deleteTicketLines(forDeleting);
        }
        if(forUpdating.length>0){
            this.output.updateLines(forUpdating);
        }
        if(forInserting.length>0){
            this.output.newLines(forInserting);
        }
        this.output.getTable(this.table.id);
    }

    goBack() {
        if (this._lastWasSearch) {
            this._lastWasSearch = false;
            this.view.clearSearchInput();  // 🧹 limpiar input
            this.showFamilies();           // volver a las familias
            return;
        }
    
        if (this.substate == Navigator.StateFamily && this.rootState) {
            this.exitState();
        }

        this.navigator.goBack();
    }
    
    

    worldTouch(){
        this.exitState();
        this.navigator.unwindUntil((state)=>{
            return state.type == Navigator.StatePlace
        });
    }

    exitState(){
        this.group = 0;
        if(GlobalParameters.AUTO_KITCHEN){
            this.output.toKitchen(this.table.id);
        }
        if(this.tableControl){
            this.output.closeTable(this.table);
        }
    }

    buscarProductos(searchText) {
        console.log("Buscando productos por:", searchText);
        this.searchText = searchText;
        window.app.isProductSearchActive = true; // <- activamos la flag
        this.output.searchProducts(searchText);
        this._lastWasSearch = true; // marca que venimos de búsqueda
    }
    
    
    
}

export default OrderController;