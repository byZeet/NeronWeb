class DateUtil{

    static IsInTimeRange(time, startTime, endTime){
        let milliseconds = DateUtil.getTimeMilliseconds(time);
        let startMilliseconds =  DateUtil.getTimeMilliseconds(startTime);
        let endMilliseconds = DateUtil.getTimeMilliseconds(endTime);
        let ret;
        if(endMilliseconds>startMilliseconds){
            ret = milliseconds>=startMilliseconds&&milliseconds<=endMilliseconds;
        } else{
            ret = milliseconds>=endMilliseconds || milliseconds<=startMilliseconds;
        }
        return ret;
    }

    static getTimeMilliseconds(date){
        let milliseconds = 
        date.getMilliseconds() +
        (date.getSeconds()*1000) +
        (date.getMinutes()*1000*60) +
        (date.getHours()*1000*60*60);
        return milliseconds;
    }
}

export default DateUtil;