const Device = require('../models/deviceModel')
const Helper = require('../helpers/helper')
const moment = require('moment')
const changeLock = 30;
class DeviceController {
    async create(req,res){
        const { idUser, idDevice, nameDevice, modelDevice} = req.body;
        const device = await Device.find({"idDevice": idDevice})
        if(device[0]){
            return res.status(400).send({err: 'Device is already register'})
        }
        const UserDevices = await Device.find({'idUser': idUser})
        if(await Helper.verifyDevicesQuatity(UserDevices.length)){
                if(!UserDevices[0].updatedAt){
                    return res.status(400).send({err: 'max quantity of devices, user can trade one device'})
                }
                let Diferencedays  = Helper.verifyDeviceChangeIsExchangeable(UserDevices[0].updatedAt)
                if(Diferencedays > changeLock){
                    return res.send({err:`max quantity of devices, user can trade one device`})
                }
                return res.send(`max devices, you can change again in  ${Diferencedays}`)
                
        }
        await Device.create({idUser, idDevice, nameDevice, modelDevice})
        return res.status(201).send({message: 'device is create successfully'})
    }
    
    async changeDevice(req, res){
        const { idUser, idDevice, nameDevice, modelDevice} = req.body;
        const devices = await Device.find({"idUser": idUser})
        const device = await Device.find({"idDevice": idDevice})
        const thirtyDaysAhead  = moment().add(30, 'days');
        const updatedAt = moment()
        let id = req.params.id;
        if(devices.length > 0){
            if(!devices[0].updatedAt){
                if(device[0]){
                    return res.status(400).send({err: 'device id is alredy register, pls change if new id device'})
                }
                await Device.findOneAndUpdate({"idDevice": id},{idUser, idDevice, nameDevice, modelDevice})
                await Device.updateMany({idUser: idUser}, {$set: {updatedAt: updatedAt}})
                return res.send({err:`device change success, you can change again in ${thirtyDaysAhead }`})
            }
            let Diferencedays  = Helper.verifyDeviceChangeIsExchangeable(devices[0].updatedAt)
            if(Diferencedays > changeLock){
                await Device.findOneAndUpdate({"idDevice": id},{idUser, idDevice, nameDevice, modelDevice})
                await Device.updateMany({idUser: idUser}, {$set: {updatedAt: updatedAt}})
                return res.send({err:`device change success, you can change again in ${thirtyDaysAhead } days`})
            }
            return res.send(`you can only trade device again in ${Diferencedays} days`)
        }
        return res.status(400).send({message: "device is not found!"})
    }

    async update(req, res){
        let id = req.params.id;
        let {nameDevice} = req.body;
        if(await Device.findOne({"idDevice": id})){
            await Device.updateOne({"idDevice": id}, { $set: {"nameDevice": nameDevice}} )
            return res.status(200).send({message:'Device updated successfully'})
        }
        return res.status(400).send({error: 'device is not found'});
    }

    async remove(req, res){
        let id = req.params.id;
        const { idUser} = req.body;
        let device = await Device.find({"idUser": idUser});
        if(device.length > 0){
            if(device.length === 1){
                if(!device[0].updatedAt){
                    return res.status(400).send({err: `the last device can not be removed because will not be able to register another, you can trade your device`})
                }
                let Diferencedays  = Helper.verifyDeviceChangeIsExchangeable(device[0].updatedAt)
                    if(Diferencedays > changeLock){
                        return res.status(400).send({err: `the last device can not be removed because will not be able to register another, you can trade your device`})
                    }
                    return res.status(400).send({err: ` the last device can not be removed because will not be able to register another, you can trade your device in ${Diferencedays} days`})

            }
            if(await Device.findOne({"idDevice": id})){
                await Device.deleteOne({"idDevice": id})  
                return res.status(200).send({message: `Device ${id} deleted successfully`})
            }
        }
        return res.status(400).send({error:'device is not found'})
    }

    async getDevices(req, res){
        let id = req.params.id;
        let userDevices = await Device.find({"idUser": id})
        if(userDevices.length > 0){
            return res.status(200).send(userDevices)
        }
        return res.status(400).send(` user ${id} don't have devices`)

    }


}

module.exports = new DeviceController