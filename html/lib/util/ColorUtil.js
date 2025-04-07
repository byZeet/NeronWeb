class ColorUtil{

    static getColor(colorString){
        let color = parseInt(colorString).toString(16).padStart(6,'0');
        let blue = color.substring(0,2);
        let green = color.substring(2,4);
        let red = color.substring(4,6);
        return red+green+blue;
    }
}

export default ColorUtil;