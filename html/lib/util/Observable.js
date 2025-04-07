class Observable{

    constructor(){
        this.observers = [];
    }

    addObserver(observer){
        this.observers.push(observer);
    }

    removeObserver(observer){
        this.observers = this.observers.filter((item)=>item!=observer);
    }

    notify(event, param=null){
        for(let observer of this.observers){
            if(!observer[event]){
                continue;
            }
            observer[event](param);
        }
    }
}

export default Observable;