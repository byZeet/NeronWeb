import GroupModel from "../GroupModel.js";
import ColorUtil from "../../../../lib/util/ColorUtil.js";
import ClientModel from "../ClientModel.js";
import PlaceModel from "../PlaceModel.js";
import PaymentWayModel from "../PaymentWayModel.js";
import HotelRoom from "../hotel/HotelRoom.js";

const defaultGroup = new GroupModel();
defaultGroup.setId("0");
defaultGroup.setDescription("Sin grupo");
defaultGroup.setColor("00000000");

class MasterDecoder{

    setProductMap(map){
        this.productMap = map;
    }

    deserializePlaces(param){
        let places = new Map();
        for(let o of param){
            let place = this.deserializePlace(o);
            places.set(place.id, place);
        }
        return places;
    }

    deserializePlace(o){
        let place = new PlaceModel();
        place.setId(o.Id);
        place.setName(o.N);
        place.setBackgroundColor(ColorUtil.getColor(o.Bg));
        place.setPriceId(o.Pr);
        place.setAskDinners(o.hasOwnProperty("AskD"));
        place.setDefaultDocType(o.DocT);
        place.setTPV(o.Tpv);
        return place;
    }

    deserializeGroups(param){
        let groups = new Map();
        groups.set(defaultGroup.id, defaultGroup);
        for(let o of param){
            let group = this.deserializeGroup(o);
            groups.set(group.id, group);
        }
        return groups;
    }

    deserializeGroup(o){
        let group = new GroupModel();
        group.setId(o.Id);
        group.setDescription(o.D);
        group.setColor(ColorUtil.getColor(o.Co));
        group.setOrder(o.O);
        group.setMaxQuantity(o.Max);
        return group;
    }

    deserializeClients(param){
        let clients = [];
        for(let o of param){
            let client = this.deserializeClient(o);
            clients.push(client);
        }
        return clients;
    }

    deserializeClient(o){
        let client = new ClientModel();
        client.setId(o.Id);
        client.setName(o.Name.trim());
        client.setDNI(o.DNI.trim());
        return client;
    }

    deserializePaymentWays(param){
        let paymentWays = [];
        for(let o of param){
            let paymentWay = this.deserializePaymentWay(o);
            if(!paymentWay.visible){
                continue;
            }
            paymentWays.push(paymentWay);
        }
        return paymentWays;
    }

    deserializePaymentWay(o){
        let paymentWay = new PaymentWayModel();
        paymentWay.setId(o.Id);
        paymentWay.setDescription(o.D.trim());
        paymentWay.setDocType(o.T.trim());
        paymentWay.setVisible(o.V);
        return paymentWay;
    }

    deserializeProductStocks(args){
        if(!this.productMap){
            return;
        }
        for(let o of args){
            let product = this.productMap.get(o.Id);
            if (!product) {
                console.warn("⚠️ Producto con ID no encontrado en el productMap:", o?.Id);
                continue;
            }
            product.setCurrentStock(o.Stock);
        }
    }
    
    

    deserializeHotelRoom(args){
        let room = new HotelRoom();
        room.setId(args["Id"]);
        room.setOccupied(args["Occupied"]);
        if(args.hasOwnProperty("Name1")){
            room.addName(1, args["Name1"]);
        }
        if(args.hasOwnProperty("Name2")){
            room.addName(2, args["Name2"]);
        }
        if(args.hasOwnProperty("Name3")){
            room.addName(3, args["Name3"]);
        }
        return room;
    }
}

export default MasterDecoder;