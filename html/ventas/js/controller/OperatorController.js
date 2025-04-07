class OperatorController{

    constructor(){

    }

    setOperatorMap(operatorMap){
        let operators = Array.from(operatorMap.values()).sort((a,b)=>{
            return parseInt(a.id) - parseInt(b.Id);
        });
        this.view.addOperators(operators);
    }

    setLoginController(controller){
        this.loginController = controller;
    }

    setOutput(output){
        this.output = output;
    }

    setView(view){
        this.view = view;
    }

    operatorTouch(operator){
        this.loginController.login(operator);
    }

    refresh(){
        this.output.getOperators();
    }
}

export default OperatorController;