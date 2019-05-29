const moment = require('moment')
const changeLock = 30;
const thirtyDaysAhead  = moment().add(30, 'days');

class Helper {
    static verifyDevicesQuatity(quantity){
        return quantity === 3
    }

    static verifyDeviceChangeIsExchangeable(devices){
        let lastDateUpdate = moment(devices).startOf('day');
        let Diferencedays = parseInt(moment.duration(thirtyDaysAhead.diff(lastDateUpdate)).asDays());
         return Diferencedays 
    }
}

module.exports = Helper;
