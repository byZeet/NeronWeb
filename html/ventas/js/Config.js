class Config{
    constructor(configObject){
        this.configObject = configObject;
    }

    get(key, defaultValue = null){
        if (this.configObject.hasOwnProperty(key)) {
            return this.configObject[key];
        }
        return defaultValue;
    }
}

export default Config;

