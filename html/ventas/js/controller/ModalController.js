const inputModalTemplate = document.getElementById("input-modal-template").innerHTML;
const alertModalTemplate = document.getElementById("alert-modal-template").innerHTML;
const confirmModalTemplate = document.getElementById("confirm-modal-template").innerHTML;
const qrScannerModalTemplate = document.getElementById("qr-scanner-modal-template").innerHTML;

class ModalController {

    constructor() {

        this.dom = $("#modal-wrapper");
        this.inputModal = $(inputModalTemplate);
        this.inputModal.find(".modal-close").click(() => {
            this.hide();
        });
        this.alertModal = $(alertModalTemplate);
        this.alertModal.find(".modal-close").click(() => {
            this.hide();
        });
        this.confirmModal = $(confirmModalTemplate);
        this.confirmModal.find(".modal-close").click(() => {
            this.hide();
        });

        this.qrScannerModal = $(qrScannerModalTemplate);
        this.qrScannerModal.find(".modal-close").click(() => {
            this.hide();
        });

    }

    setTicketLineModal(ticketLineModal) {
        this.ticketLineModal = ticketLineModal;
    }

    setGroupModal(groupModal) {
        this.groupModal = groupModal;
    }
    

    setButtonModal(buttonModal){
        this.buttonModal = buttonModal;
    }

    setNumberInputModal(numberInputModal){
        this.numberInputModal = numberInputModal; 
    }

    askInput(type, header, text, defaultValue, callback, cancelCallback) {
        switch(type){
            case ModalController.TYPE_STRING:
                this.askTextInput(header, text, defaultValue, callback, cancelCallback);
                break;
            case ModalController.TYPE_INTEGER:
                this.askIntegerInput(header, text, defaultValue, callback, cancelCallback);
                break;
            case ModalController.TYPE_DOUBLE:
                this.askDoubleInput(header, text, defaultValue, callback, cancelCallback);
                break;
            case ModalController.TYPE_PRICE:
                this.askPriceInput(header, text, defaultValue, callback, cancelCallback);
                break;
                
        }
    }

    askDoubleInput(header, text, defaultValue, callback,cancelCallback=null){
        this.numberInputModal.setPassword(false);
        this.numberInputModal.askDecimal(header, callback, defaultValue, cancelCallback);
        this.switchTo(this.numberInputModal.dom);
    }

    askPriceInput(header, text, defaultValue, callback, cancelCallback=null){
        this.numberInputModal.setPassword(false);
        this.numberInputModal.askPrice(header, callback, defaultValue, cancelCallback);
        this.switchTo(this.numberInputModal.dom);
    }

    askIntegerInput(header, text, defaultValue, callback, cancelCallback=null){
        this.numberInputModal.setPassword(false);
        this.numberInputModal.askInteger(header, callback, defaultValue, cancelCallback);
        this.switchTo(this.numberInputModal.dom);
    }

    askIntegerTextInput(header, text, defaultValue, callback, cancelCallback=null){
        this.numberInputModal.setPassword(false);
        this.numberInputModal.askIntegerText(header, callback, defaultValue, cancelCallback);
        this.switchTo(this.numberInputModal.dom);
    }

    askTextInput(header, text, defaultValue, callback, cancelCallback=null){
        let inputModal = this.inputModal;
        inputModal.find(".modal-header").text(header);
        inputModal.find(".modal-input").attr("type", "text").val(defaultValue);
        inputModal.find(".modal-input-description").text(text);
        this.inputModal.find(".modal-accept").off("click").click(() => {
            let val = inputModal.find(".modal-input").val();
            this.hide();
            callback(val);
        });
        this.dom.children().detach();
        this.dom.html(this.inputModal);
        this._show();
        inputModal.find(".modal-input").focus();
    }

    askPasswordInput(header, text, defaultValue, callback){
        this.numberInputModal.setPassword(true);
        this.numberInputModal.askInteger(header, callback, defaultValue);
        this.switchTo(this.numberInputModal.dom);
    }
    
    askGroup(callback) {
        this.groupModal.setCallback(callback);
        this.switchTo(this.groupModal.dom);
    }

    showButtons(buttons){
        this.buttonModal.setButtons(buttons);
        this.switchTo(this.buttonModal.dom);
        this._show(); 
    }

    switchTo(dom) {
        this.dom.children().detach();
        this.dom.html(dom);
        this._show();
    }

    ticketLine(line) {
        this.ticketLineModal.setLine(line);
        this.switchTo(this.ticketLineModal.dom);
    }

    confirm(
        header, 
        text, 
        callback, 
        acceptText="Aceptar",
        cancelText="Cancelar"
    ) {
        let confirmModal = this.confirmModal;
        confirmModal.find(".modal-header").text(header);
        confirmModal.find(".confirm-modal-text").html(text);
        confirmModal.find(".modal-close").text(cancelText).off("click").click(()=>{
            this.hide();
        });
        confirmModal.find(".modal-accept").text(acceptText).off("click").click(() => {
            this.hide();
            callback();
        });
        this.switchTo(confirmModal);
    }

    yesOrNo(
        header, 
        text, 
        callback, 
        yesText="Sí",
        noText="No"
    ) {
        let confirmModal = this.confirmModal;
        confirmModal.find(".modal-header").text(header);
        confirmModal.find(".confirm-modal-text").html(text);
        confirmModal.find(".modal-accept").text(yesText).off("click").click(() => {
            this.hide();
            callback(true);
        });
        confirmModal.find(".modal-close").text(noText).off("click").click(() => {
            this.hide();
            callback(false);
        });
        this.switchTo(confirmModal);
    }

    alert(header, text, buttonTextParam = null, callbackParam = null) {
        let alertModal = this.alertModal;
        alertModal.find(".modal-header").text(header);
        alertModal.find(".alert-modal-text").html(text);
        let callback = callbackParam;
        if (callback == null) {
            callback = () => {
                this.hide();
            };
        }
        let buttonText = buttonTextParam;
        if(buttonText == null){
            buttonText = "Aceptar";
        }
        alertModal.find(".modal-alert-button").text(buttonText).off("click").click(callback);
        this.switchTo(alertModal);
    }

    qrScanner(callback){
        /*let modal = this.qrScannerModal;
        modal.find(".modal-header").text("Escaneando QR");
        modal.find(".modal-close").text("Cerrar");
        let args = {video: modal.find('.qr-scanner-video').get(0)};
        window.URL.createObjectURL = (stream) => {
                    args.video.srcObject = stream;
                    return stream;
        };
        let scanner = new Instascan.Scanner(args);
        scanner.addListener('scan', function (content) {
            callback(content);
        });
        this.switchTo(modal);
        Instascan.Camera.getCameras().then((cameras)=>{
            if (cameras.length > 0) {
            scanner.start(cameras[1]);
            } else {
            //this.alert("Sin cámaras", "No se han encontrado cámaras");
            }
        }).catch((e) => {
            this.alert("Error de escáner", e);
        });*/
        
    }

    _show() {
        this.dom.css("display", "grid");
    }

    hide() {
        this.dom.css("display", "none");
    }
}

ModalController.TYPE_STRING = 1;
ModalController.TYPE_INTEGER = 2;
ModalController.TYPE_DOUBLE = 3;
ModalController.TYPE_PRICE = 4;

export default ModalController;