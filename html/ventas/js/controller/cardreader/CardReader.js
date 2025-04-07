var startDTO = {
    cardNumberHashDomain: null,
    enableDNI: null,
    enableProprietaryCommands: false,
    executeOptions: {
        method: "polling",
        receiverClass: null,
        receiverPackage: null,
        userData: null
    },
    language: "es",
    pinpad: "*",
    readType: "cardFirst",
    requestedAmount: 0
};

const pollDTO = {
    pinpad: "*"
}

const pollTimeout = 250;

//const baseUrl = "http://localhost:8887";
const baseUrl = "pinpad";

class CardReader{
    constructor(){
        this.open = false;
        this.callback = null;
    }

    read(amount, callback){
        if(this.open) return;
        this.open = true;
        this.callback = callback;
        startDTO.requestedAmount = amount*100; 
        $.ajax({
            url: baseUrl + "/readCard/start",
            method: "POST",
            data: JSON.stringify(startDTO),
            contentType: "application/json",
            dataType: "json",
            processData: false,
            success: (response)=>{
                this.startCallback(response);
            },
            error: ()=>{
                this.close();
                this.callback(3);
            }
        });
    }

    startCallback(response){
        if(!response.info.started){
            this.close();
            this.callback(3);
            return;
        }
        setTimeout(()=>{
            this.poll();
        }, pollTimeout);
    }

    poll(){
        $.ajax({
            url: baseUrl + "/readCard/poll",
            method: "POST",
            data: JSON.stringify(pollDTO),
            dataType: "json",
            processData: false,
            contentType: "application/json",
            success: (response)=>{
                this.pollCallback(response);
            },
            error: ()=>{
                this.close();
            }
        });
    }

    pollCallback(response){
        if(!response.result){
            setTimeout(()=>{
                this.poll();
            }, pollTimeout);
            return;
        }
        this.close();
        if(response.result.success){
            this.callback(1);
        } else{
            this.callback(2);
        }
    }

    close(){
        this.open = false;
    }
}

export default CardReader;