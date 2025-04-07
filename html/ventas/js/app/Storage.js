class Storage{

    constructor(type){
        this.storage = window[type];
    }

    set(key, item){
        try{
            this.storage.setItem(key, item);
            return true;
        } catch(e){
            return false;
        }
    }

    setObject(key, item){
        this.set(key, JSON.stringify(item));
    }

    setAll(list){
        try{
            for(let o of list){
                this.storage.setItem(o[0], o[1]);
            }
            return true;
        } catch(e){
            for(let o of list){
                this.storage.removeKey(o[0]);
            }
            return false;
        }
    }

    remove(key){
        if(!this.storage){
            return;
        }
        this.storage.removeItem(key);
    }

    get(key){
        if(!this.storage){
            return null;
        }
        return this.storage.getItem(key);
    }

    getObject(key){
        let value = this.get(key);
        if(value == null){
            return null;
        }
        return JSON.parse(value);
    }
}

const SessionStorage = new Storage("sessionStorage");
const LocalStorage = new Storage("localStorage");

export {SessionStorage, LocalStorage}