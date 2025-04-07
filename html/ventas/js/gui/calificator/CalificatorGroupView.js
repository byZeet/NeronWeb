class CalificatorGroupView{

    constructor(){
        //this.views = [];
    }

    setDom(dom){
        this.dom = dom;
    }

    empty(){
        this.dom.children().detach();
    }

    addCalificatorView(view){
        //this.views.push(view);
        this.dom.append(view.dom);
        //this.sort();
    }

    sort(){
      this.empty();
      this.views.sort((a, b)=>{
        return a.calificator.order - b.calificator.order;
      });
      for(let view in this.views){
        this.dom.append(view.dom);
      } 
    }

}   

export default CalificatorGroupView;