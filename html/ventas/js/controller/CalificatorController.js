class CalificatorController {
    constructor() {
        this.selected = new Map();
        this.currentIndex = 0;
        this.groups = [];
        this.changed = false;
    }

    setModalController(controller) {
        this.modalController = controller;
    }

    setNavigator(navigator) {
        this.navigator = navigator;
    }

    addGroup(group) {
        this.groups.push(group);
        this.view.addGroup(group);
        group.getObservable().addObserver(this);
    }

    addCalificator(calificator) {
        this.view.addCalificator(calificator);
    }

    setOutput(output) {
        this.output = output;
    }

    setView(view) {
        this.view = view;
    }

    toggleSelected(calificator){
        if (this.selected.has(calificator.id)) {
            this.unselect(calificator);
        } else {
            this.select(calificator);
        }
    }

    changeGroup(index) {
        this.currentIndex = index;
        this.group = this.groups[index];
        this.view.changeGroup(this.group);
    }

    nextState() {
        if (this.currentIndex >= this.groups.length - 1) {
            this.changeGroup(0);
        } else {
            this.changeGroup(this.currentIndex + 1);
        }
    }

    prevState() {
        if (this.currentIndex <= 0) {
            this.changeGroup(this.groups.length - 1);
        } else {
            this.changeGroup(this.currentIndex - 1);
        }
    }

    reset() {
        this.selected.clear();
        this.view.reset();
        this.changed = false;
    }

    newCalificator() {
        if (this.group.isAll) {
            this.modalController.alert(
                "Grupo no permitido",
                "No se puede crear calificadores en este grupo."
            );
            return;
        }
        this.modalController.askTextInput(
            "Insertando descriptor",
            "",
            "",
            (calificator) => {
                this._newCalificator(calificator);
            }
        );
    }

    _newCalificator(calificator){
        let alreadyExists = this.group.calificators.some((c)=>{
            return c.description.toUpperCase()==calificator.toUpperCase()
        })
        if(alreadyExists){
            this.modalController.alert("Error", "Ya existe un calificador con ese nombre");
            return;
        }
        this.output.newCalificator(this.group.id, calificator);
        this.output.getCalificators();
    }

    setStartingCalificators(calificators) {
        this.reset();
        for (let calificator of calificators) {
            this.select(calificator);
        }
    }

    start() {
        if (this.defaultGroup == null) {
            this.changeGroup(0);
        }
        for (let i = 0; i < this.groups.length; i++) {
            if (this.defaultGroup === this.groups[i]) {
                this.changeGroup(i);
                break;
            }
        }
    }

    setDefaultGroup(groupId) {
        if (groupId == 0) {
            this.defaultGroup = null;
            this.view.setRequiredGroup(null);
            return;
        }
        for (let i = 0; i < this.groups.length; i++) {
            if (groupId == this.groups[i].id) {
                this.defaultGroup = this.groups[i];
                break;
            }
        }
        if (this.obligatory) {
            this.view.setRequiredGroup(this.defaultGroup);
        } else {
            this.view.setRequiredGroup(null);
        }
    }

    setObligatory(obligatory) {
        this.obligatory = obligatory;
    }

    send() {
        let calificators = [];
        for (let calificator of this.selected.values()) {
            calificators.push(calificator);
        }
        if (this.obligatory) {
            let hasCalificator = calificators.some((calificator) => {
                return calificator.group === this.defaultGroup;
            });
            if (!hasCalificator) {
                this.modalController.alert(
                    "Calificador obligatorio", 
                    "Este producto requiere un calificador obligatorio del grupo " + 
                    this.defaultGroup.description.toUpperCase() + "."
                );
                return;
            }
        }
        this.navigator.goBack();
        this.sendCallback(calificators);
    }

    select(calificator) {
        if (this.selected.size >= 5) {
            this.modalController.alert(
                "Máximo alcanzado", 
                "No puedes añadir más de cinco descriptores a una línea."
            );
            return;
        }
        this.selected.set(calificator.id, calificator);
        this.view.select(calificator.id);
        this.changed = true;
    }

    unselect(calificator) {
        this.selected.delete(calificator.id);
        this.view.unselect(calificator.id);
        this.changed = true;
    }

    setSendCallback(callback) {
        this.sendCallback = callback;
    }

    goBack(){
        if (!this.changed) {
            this.navigator.goBack();
            return;
        }
        this.modalController.confirm(
            "Cancelando modificaciones", 
            "¿Estás seguro de querer cancelar las modificaciones?", 
            () => {
                this.navigator.goBack();
            }
        );
    }

    sort(){
        this.view.sort();
    }

}


export default CalificatorController;