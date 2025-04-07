class Guard{}

Guard.AgainstNotHavingProperty = function(object, propertyName){
    if(!object.hasOwnProperty(propertyName)){
        throw new Error(propertyName +" not found");
    }
}

export default Guard;