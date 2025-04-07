class PermissionManager{

    setGroupPermissions(groupPermissions){
        this.groupPermissions = groupPermissions;
    }

    setPermissions(permissions){
        this.permissions = permissions;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setOperator(operator){
        this.operator = operator;
    }

    setOutput(output){
        this.output = output;
    }

    isAllowed(type){
        let permission = this.getPermission(type);
        return permission.permitted;
    }

    getPermission(type){
        let groupPermission = this.groupPermissions.get(this.operator.groupId);
        let permission = groupPermission.get(type);
        return permission;
    }

    permissionDenied(){
        this.modalController.alert(
            "Contraseña incorrecta", 
            "La contraseña no coincide", 
            "Aceptar", 
            ()=>{
                this.askPermission(this.type, this.callback);
            }
        );
    }

    permissionGranted(type){
        this.permissions.set(type, true);
        this.callback();
    }

    askPermission(type, callback){
        this.type = type;
        this.callback = callback;
        let permission =this.getPermission(type);
        if(!permission.permitted){
            this.modalController.alert("Permiso denegado", "No tienes permiso para realizar esta acción.")
            return false;
        }
        if(!permission.required){
            return true;
        }
        if(this.permissions.get(type)){
            return true;
        }
        this.modalController.askPasswordInput(
            "Introduciendo contraseña",
            "Contraseña:",
            "",
            (password) => {
                this.output.askPermission(type, password);
            }
        );
        return false;
    }

}

export default PermissionManager;