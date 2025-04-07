const numberInputModalTemplate = document.getElementById("number-input-modal-template").innerHTML;

const MODE_INTEGER = 1;
const MODE_DECIMAL = 2;
const MODE_PRICE = 3;

class NumberInputModal{

    constructor(){
        this.dom = $(numberInputModalTemplate);
        this.content = this.dom.find(".modal-content");
        this.input = this.dom.find(".modal-input");
        this.header = this.dom.find(".modal-header");
        this.closeButton = this.dom.find(".modal-close");
        this.acceptButton = this.dom.find(".modal-accept");
        this.closeButton.click(()=>{
            this.modalController.hide();
            if(this.exitCallback){
                this.exitCallback();
            }
        });
        this.acceptButton.click(()=>{
            let currentInput = this.input.val();
            currentInput = currentInput == "" ? "0" :currentInput;
            currentInput = currentInput.replace(",", ".");
            let value;
            if(this.isString){
                value = currentInput;
            } else if(this.mode == MODE_INTEGER){
                value = parseInt(currentInput);
            } else{
                value = parseFloat(currentInput);
            }
            this.modalController.hide();
            this.callback(value);
        });
        this.buttons = this.dom.find(".number-input-button");
        for(let button of this.buttons){
            let value = $(button).attr("data-value");
            if(value==','){
                this.decimalButton = $(button);
            }
            $(button).click(()=>{
                this.keyPress(value);
            });
        }
    }

    setIsString(isString){
        this.isString = isString;
    }

    askInteger(headerText, callback, defaultValue, exitCallback = null){
        this.reset(MODE_INTEGER, headerText, defaultValue, callback, exitCallback);
        this.decimalButton.addClass("invisible");
    }

    askDecimal(headerText, callback, defaultValue, exitCallback = null){
        this.reset(MODE_DECIMAL, headerText, defaultValue, callback, exitCallback);
        this.decimalButton.removeClass("invisible");
    }

    askPrice(headerText, callback, defaultValue, exitCallback = null){
        this.reset(MODE_PRICE, headerText, defaultValue, callback, exitCallback);
        this.decimalButton.removeClass("invisible");
    }

    askIntegerText(headerText, callback, defaultValue, exitCallback = null){
        this.reset(MODE_INTEGER, headerText, defaultValue, callback, exitCallback);
        this.setIsString(true);
        this.decimalButton.addClass("invisible");
    }

    setPassword(flag){
        if(flag){
            this.input.attr("type", "password");
        } else{
            this.input.attr("type", "text");
        }
    }

    keyPress(keyValue){
        let currentInput = this.input.val();
        if(this.firstTouch){
            currentInput = "";
            this.input.removeClass("first-touch");
            this.firstTouch = false;
        }
        if(keyValue=='C'){
            if(currentInput.length>0){
                currentInput = currentInput.substring(0, currentInput.length-1);
            }
            this.input.val(currentInput);
            return;
        }
        if(keyValue==','){
            if(this.mode == MODE_INTEGER){
                return;
            }
            let index = currentInput.indexOf(keyValue);
            if(index>-1){
                return;
            }
            if(currentInput.length==0){
                currentInput = "0";
            } 
            currentInput += keyValue;
            this.input.val(currentInput);
            return;
        }
        
        if(this.mode == MODE_PRICE){
            let decimalIndex = currentInput.indexOf(",");
            if(decimalIndex>-1 && decimalIndex<=currentInput.length-3){
                return;
            }
        }
        currentInput+=keyValue;
        this.input.val(currentInput);
    }

    setModalController(controller){
        this.modalController = controller;
    }

    reset(mode, header, defaultValue, callback, exitCallback=null){
        this.mode = mode;
        this.callback = callback;
        this.exitCallback = exitCallback;
        this.header.text(header);
        this.input.val(defaultValue.toString().replace(".", ","));
        if(defaultValue==""){
            this.firstTouch = false;
            this.input.removeClass("first-touch");
        } else{
            this.firstTouch = true;
            this.input.addClass("first-touch");
        }
    }
}

export default NumberInputModal;