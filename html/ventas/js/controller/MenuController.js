import Navigator from "../app/Navigator.js";

class MenuController{

    constructor(){
        this.groupSelections = new Map(); 
        this.lineMap = new Map();
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setMenuSelectionController(controller){
        this.menuSelectionController = controller;
    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setGroupMap(groupMap){
        this.groupMap = groupMap;
    }

    setView(view){
        this.view = view;
    }

    setMultiSelect(multiSelect){
        this.multiSelect = multiSelect;
    }

    setQuantity(quantity){
        this.quantity = quantity;
    }

    setSendCallback(callback){
        this.sendCallback = callback;
    }

    setMenu(menu){
        this.menu = menu;
        this.resetState();
        for(let [menuGroup, products] of menu.menuLines.entries()){
            let group = this.groupMap.get(menuGroup);
            this.groups.push(group);
            let groupSelection = {
                quantity: 0,
                lastSelection: 0,
                productSelections: new Map()
            }
            for(let product of products){
                let productSelection = {
                    product: product,
                    quantity: 0,
                    lines: []
                }
                groupSelection.productSelections.set(product.id, productSelection);
            }
            this.groupSelections.set(group.id, groupSelection);
        }
        this.view.changeMenu(menu);
        this.groups.sort((a, b)=>a.id<b.id?-1:1);
        this.setGroup(this.groups[0]);
        this.changed = false;
    }

    setStartingSelections(selections){
        for(let selection of selections){
            let group = selection.group;
            let product = selection.product;
            let productId = product.id;
            let quantity = selection.quantity;
            let calificators = selection.calificators;
            let groupSelection = this.groupSelections.get(group);
            if(!groupSelection){
                groupSelection = this.createGroupOption(group);
            }
            let productSelection = groupSelection.productSelections.get(productId);
            if(!productSelection){
                productSelection = this.createProductOption(group, product);
            }
            groupSelection.quantity+=quantity;
            productSelection.quantity+=quantity;
            let line = this.createLine(group, product, quantity);
            line.calificators = calificators;
            if(selection.fastFoodSelections){
                line.fastFoodSelections = selection.fastFoodSelections;
            }
            productSelection.lines.push(line);
            this.lineMap.set(line.id, line);
            this.view.getMenuView(group, productId).setQuantity(productSelection.quantity);
        }
        this.view.changeGroup(this.currentGroup);
        this.changed = false;
    }

    change(){
        this.changed = true;
    }

    setGroup(group){
        this.currentGroup = group;
        this.view.changeGroup(group);
    }

    resetState(){
        this.currentId = 1;
        this.groupSelections.clear();
        this.lineMap.clear();
        this.groups = [];
        this.currentGroupIndex = 0;
        this.currentGroup = this.groups[0];
    }

    updateSelectionQuantity(groupId, productId, quantity){
        let groupSelection = this.groupSelections.get(groupId);
        let productSelection = groupSelection.productSelections.get(productId);
        groupSelection.quantity+=quantity;
        productSelection.quantity+=quantity;
        this.view.getMenuView(groupId, productId).setQuantity(productSelection.quantity);
    }

    updateLineQuantity(line, quantity){
        if(quantity==0){
            return;
        }
        let groupId = line.group;
        let productId = line.product.id;
        let quantityDiff = quantity-line.quantity;
        let groupSelection = this.groupSelections.get(groupId);
        if(!this.multiSelect && groupSelection.quantity+quantityDiff>this.quantity){
            this.alertMaximum();
            return;
        }
        this.updateSelectionQuantity(groupId, productId, quantityDiff);
        line.edit = true;
        line.quantity = quantity;
        this.change();
    }

    updateLineCalificators(line, calificators){
        line.edit = true;
        line.calificators = calificators;
        this.change();
    }

    addProductLine(productId, group, quantity, calificators){
        let groupSelection = this.groupSelections.get(group);
        groupSelection.quantity += quantity;
        let productSelection = groupSelection.productSelections.get(productId);
        productSelection.quantity += quantity;
        let line = this.createLine(group, productSelection.product, quantity);
        line.calificators = calificators;
        productSelection.lines.push(line);
        this.lineMap.set(line.id, line);
        this.view.getMenuView(group, productId).setQuantity(productSelection.quantity);
        this.checkNextGroup(groupSelection.quantity);
    }

    checkNextGroup(quantity){
        if(this.multiSelect){
            return;
        }
        if(quantity<this.quantity){
            return;
        }
        if(this.currentGroupIndex == this.groups.length-1){
            return;
        }
        this.nextGroup();
    }

    deleteLine(line){
        this.removeLine(line);
        this.lineMap.delete(line.id);
        this.change();
    }

    removeLine(line){
        let groupId = line.group;
        let productId = line.product.id;
        let quantity = line.quantity;
        let groupSelection = this.groupSelections.get(groupId);
        let productSelection = groupSelection.productSelections.get(productId);
        productSelection.lines = productSelection.lines.filter(iLine => iLine.id !== line.id);
        this.updateSelectionQuantity(groupId, productId, -quantity);
    }

    updateLineGroup(line, groupId){
        let product = line.product;
        let quantity = line.quantity;
        let sourceGroupSelection = this.groupSelections.get(line.group);
        let sourceProductSelection = sourceGroupSelection.productSelections.get(product.id);
        let targetGroupSelection =this.groupSelections.get(groupId);
        if(!targetGroupSelection){
            targetGroupSelection =  this.createGroupOption(groupId);
        }
        if(!this.multiSelect && targetGroupSelection.quantity+quantity>this.quantity){
            this.alertMaximum();
            return;
        }
        let targetProductSelection =targetGroupSelection.productSelections.get(product.id);
        if(!targetProductSelection){
            targetProductSelection =  this.createProductOption(groupId, product);
        }
        targetProductSelection.lines.push(line);
        this.updateSelectionQuantity(groupId, product.id, quantity);
        this.removeLine(line);
        line.edit = true;
        line.group = groupId;
        this.change();
    }

    //
    createLine(group, product, quantity){
        let line = {
            id: this.currentId++,
            product: product,
            group: group,
            quantity: quantity
        }
        return line;
    }

    createGroupOption(groupId){
        let group = this.groupMap.get(groupId);
        let groupSelection = {
            quantity: 0,
            lastSelection: 0,
            productSelections: new Map()
        }
        this.groupSelections.set(groupId, groupSelection);
        this.groups.push(group);
        this.view.newGroup(groupId);
        return groupSelection;
    }

    createProductOption(groupId, product){
        let groupSelection = this.groupSelections.get(groupId);
        let productSelection = {
            product: product,
            quantity: 0,
            lines: []
        }
        groupSelection.productSelections.set(product.id, productSelection);
        this.view.newProduct(groupId, product);
        return productSelection;
    }

    //Controller callback
    fastFood(product, group, items){
        let groupSelection = this.groupSelections.get(group);
        let productSelection = groupSelection.productSelections.get(product.id);
        for(let item of items){
            groupSelection.quantity++;
            productSelection.quantity++;
            let line = this.createLine(group, productSelection.product, 1);
            line.fastFoodSelections = item.selections;
            line.calificators = item.calificators;
            productSelection.lines.push(line);
            this.lineMap.set(line.id, line);
        }
        this.view.getMenuView(group, product.id).setQuantity(productSelection.quantity);
        //this.navigator.goBack();
        this.checkNextGroup(groupSelection.quantity);
        this.menuSelectionController.refresh();
        this.change();
    }


    //GUI Events
    productTouch(product, groupId){
        let group = this.groupMap.get(groupId);
        let groupSelection = this.groupSelections.get(groupId);
        let productSelection = groupSelection.productSelections.get(product.id);
        if(productSelection.quantity > 0){
            this.navigator.navigateTo({
                type: Navigator.StateMenuSelection,
                group: group,
                selection: productSelection
            });
            return;
        }
        if(!this.multiSelect&&groupSelection.quantity==this.quantity&&this.quantity>1){
            this.alertMaximum();
            return;
        }
        if(this.quantity == 1){
            this.pt_setQuantity(product, groupId,  1);
        } else{
            this.modalController.askIntegerInput("Introduciendo cantidad", "Cantidad:", "", (quantity) => {
                this.pt_setQuantity(product, groupId, quantity);
            });
        }
    }
    
    pt_setQuantity(product, group, quantity){
        if(quantity==0){
            return;
        }
        let groupSelection = this.groupSelections.get(group);
        if(!this.multiSelect && groupSelection.quantity+quantity>this.quantity){
            this.alertMaximum();
            return;
        }
        let packLine = {
            quantity: quantity,
            group: group,
            product: product
        }

        if(product.askCalificators || product.hasObligatoryCalificator()){
            this.pt_askCalificators(packLine);
        } else{
            this.pt_setCalificators(packLine, []);
        }
    }

    pt_askCalificators(line){
        this.navigator.navigateTo({
            type: Navigator.StateCalificator,
            calificators: [],
            obligatory: line.product.hasObligatoryCalificator(),
            defaultGroup: line.product.getDefaultGroup(),
            sendCallback: (calificators)=>{
                this.pt_setCalificators(line, calificators);
            }
        });
    }

    pt_setCalificators(line, calificators){
        if(line.product.isFastFood()){
            this.navigator.navigateTo({
                type: Navigator.StateFastFood,
                product: line.product,
                quantity: line.quantity,
                calificators: calificators,
                sendCallback: (items) => {
                    this.fastFood(line.product, line.group, items);
                }
            });
        } else{
            for(let i=0; i<line.quantity; i++){
                this.addProductLine(line.product.id, line.group, 1, calificators);
            }
            this.change();
        }
    }

    nextGroup(){
        this.currentGroupIndex++;
        if (this.currentGroupIndex == this.groups.length) {
            this.currentGroupIndex = 0;
        }
        this.setGroup(this.groups[this.currentGroupIndex]);
    }

    previousGroup(){
        this.currentGroupIndex--;
        if (this.currentGroupIndex == -1) {
            this.currentGroupIndex = this.groups.length - 1;
        }
        this.setGroup(this.groups[this.currentGroupIndex]);
    }

    sendTouch(){
        this.navigator.goBack();
        this.sendCallback(this.lineMap);
    }

    nextMenu(){
        this.sendCallback(this.lineMap);
        this.setQuantity(1);
        this.setMenu(this.menu);
    }

    //Modal
    alertMaximum(){
        this.modalController.alert("Máximo alcanzado", "No se pueden añadir más platos por grupo que el número de menús.");
    }

    goBack(){
        if(!this.changed){
            this.navigator.goBack();
            return;
        }
        this.modalController.confirm("Cancelando modificaciones", "¿Estás seguro de querer cancelar las modificaciones?", ()=>{
            this.navigator.goBack();
        });
    }
}



export default MenuController;