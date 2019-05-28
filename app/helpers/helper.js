const moment = require('moment')
const changeLock = 30;
const thirdDaysAhead  = moment().add(30, 'days');

class Helper {
    static verifyDevicesQuatity(quantity){
        return quantity === 3
    }

    static verifyIfUserDontHaveDevicesChange(devices){
       return devices.updateAt == undefined
    }
    static verifyDeviceChangeIsExchangeable(devices){
        let lastDateUpdate = moment(devices.updateAt).startOf('day');
        let Diferencedays = parseInt(moment.duration(thirdDaysAhead.diff(lastDateUpdate)).asDays());
         return Diferencedays < changeLock 
    }


  
}

module.exports = Helper;
