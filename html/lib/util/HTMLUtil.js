class HTMLUtil{
    static createElementFromTemplate(template){
        let div = document.createElement("div");
        div.innerHTML = template.trim();
        return div.firstChild;
    }

    static createElementFromTemplateId(id){
        let template = document.getElementById(id).innerHTML;
        return HTMLUtil.createElementFromTemplate(template);
    }
}

export default HTMLUtil;