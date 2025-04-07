
import {LocalStorage} from "../app/Storage.js";

class LoginController {

    constructor(app) {
        this.app = app;
    }

    setConnectionToken(operatorId, connectionToken) {
        this.operatorId = operatorId;
        this.connectionToken = connectionToken;
    }

    setModalController(controller) {
        this.modalController = controller;
    }

    setOutput(output) {
        this.output = output;
    }

    setCommanderId(commanderId) {
        this.commanderId = commanderId;
    }

    rememberOperator(connectionToken) {
        this.output.openConnection({
            commanderId: this.commanderId,
            connectionToken: connectionToken
        });
    }

    connect(operatorId, password) {
        this.output.openConnection({
            operatorId: operatorId,
            commanderId: this.commanderId,
            password: password
        });
    }

    login(operator) {
        if (operator.hasPassword) {
            this.modalController.askPasswordInput(
                "Introduciendo contraseña",
                "Contraseña:",
                "",
                (password) => {
                    this.connect(operator.id, password);
                }
            );
        } else {
            this.connect(operator.id, null);
        }
    }

    loginResponse(response) {
        let status = response.Status;
        if (status == 1) {
            this.app.setPermissions(new Map());
            this.app.changeOperator("" + response.OperatorId);
            if (response.hasOwnProperty("ConnectionToken")) {
                LocalStorage.set("ConnectionToken", response.ConnectionToken);
            }
            if (response.hasOwnProperty("TableId")) {
                
            }
        } else if (status == 2) {
            this.modalController.alert(
                "Conexión fallida",
                "Se ha alcanzado el máximo de conexiones abiertas: " + response.MaxConnections + "."
            );
        } else if (status == 3) {
            this.modalController.alert(
                "Conexión fallida",
                "La contraseña introducida no coincide."
            );
        } else if (status == 4) {

        } else if (status == 5) {
            this.modalController.alert(
                "Conexión fallida",
                "El operador seleccionado no está activo"
            );
        }
    }

    disconnect() {
        this.modalController.confirm(
            "Cerrando operador",
            "¿Estás seguro de querer cerrar este operador?",
            () => {
                this.output.closeOperator();
            });
    }
}

export default LoginController;