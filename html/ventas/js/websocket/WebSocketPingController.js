class WebSocketPingController{

    constructor(app){
        this.app = app;
        this.lastPing = 0;
    }

    setOutput(output){
        this.output = output;
    }

    setPingInterval(pingInterval){
        this.pingInterval = pingInterval;
    }

    setMaxWaiting(maxWaiting){
        this.maxWaiting = maxWaiting;
    }

    start(){
        this.interval = setInterval(()=>{
            if(this.isOverLimit()){
                this.app.onConnectionClose();
            }
        }, this.pingInterval);
    }
    
    stop(){
        if(this.interval){
            clearInterval(this.interval);
        }
    }

    pongReceived(){
        this.output.sendPing();
        this.lastPing = (new Date()).getTime();
    }

    isOverLimit(){
       if(this.lastPing == 0){
            return false;
       }
       let now = (new Date()).getTime();
       return now-this.lastPing>this.pingInterval+this.maxWaiting;
    }
}

export default WebSocketPingController;