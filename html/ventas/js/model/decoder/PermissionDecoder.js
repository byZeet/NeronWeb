import PermissionModel from "../PermissionModel.js";

class PermissionDecoder{

    decodeGroups(groups){
        let groupMap = new Map();
        for(let [group, permissions] of Object.entries(groups)){
            let permissionMap = this.decodePermissions(permissions);
            groupMap.set(group, permissionMap);
        }
        return groupMap;
    }

    decodePermissions(permissions){
        let permissionMap = new Map();
        for(let [permissionId, permission] of Object.entries(permissions)){
            let permissionModel = this.decodePermission(permission);
            permissionMap.set(permissionId, permissionModel);
        }
        return permissionMap;
    }

    decodePermission(permission){
        let permissionModel = new PermissionModel();
        permissionModel.setPermitted(permission.hasOwnProperty("P"));
        permissionModel.setPasswordRequired(permission.hasOwnProperty("R"));
        return permissionModel;
    }
}

export default PermissionDecoder;