import ModalController from "../ModalController.js";
import SelectModal from "../../gui/modal/SelectModal.js";
import GlobalParameters from "../../app/GlobalParameters.js";

class HotelTransferManager{

    setOutput(output){
        this.output = output;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setSelectModal(modal){
        this.selectModal = modal;
    }

    transfer(tableId, hotelRoom){
        if(!hotelRoom){
            this.modalController.alert("Habitación inexistente", "No se ha encontrado la habitación con ese número.");
            return;
        }
        if(!hotelRoom.occupied){
            this.modalController.alert("Habitación vacía", "La habitación está vacía.");
            return;
        }
        let dto = {
            tableId: tableId,
            room: hotelRoom
        }
        this.askCodes(dto);
    }

    askCodes(dto){
        let options = [];
        for(let code of GlobalParameters.HotelCodes){
            if(code===""){
                continue;
            }
            options.push({
                id: code,
                description: code
            });
        }
        this.selectModal.setTitle("Seleccionando concepto");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((code)=>{
            dto.code = code;
            this.askClient(dto);
        });
        this.selectModal.show();
    }

    askClient(dto){
        let names = dto.room.names;
        let options = [];
        for(let [key, value] of names.entries()){
            options.push({
                id: key,
                description: value
            });
        }
        if(options.length==1){
            let option = options[0];
            dto.client = {
                key: option.id,
                value: option.description
            };
            this.askConfirm(dto);
            return;
        }
        this.selectModal.setTitle("Seleccionando cliente");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((key)=>{
            let value = dto.room.names.get(key);
            dto.client = {
                key: key,
                value: value
            };
            this.askConfirm(dto);
        });
        this.selectModal.show();
    }


    askConfirm(dto){
        let text = "¿Quieres realizar este traspaso?<br><br>";
        text+= "<b>Habitación:</b> "+dto.room.id+"<br>";
        text+="<b>Concepto:</b> "+dto.code+"<br>";
        text+="<b>Cliente:</b> "+dto.client.value;
        this.modalController.confirm("Confirmando traspaso", text, ()=>{
            this.output.transferHotelRoom(dto);
            this.modalController.alert("Orden enviada", "Se ha enviado la orden de traspaso.");
        });
    }
}

export default HotelTransferManager;