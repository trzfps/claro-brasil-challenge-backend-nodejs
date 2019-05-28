const Device = require('../models/deviceModel')
const Helper = require('../helpers/helper')
const moment = require('moment')
class DeviceController {
    async create(req,res){
        const { idUser, idDevice, nameDevice, modelDevice} = req.body;
        const device = await Device.find({"idDevice": idDevice})
        if(device[0]){
            return res.status(400).send({err: 'Device is already register'})
        }
        const UserDevices = await Device.find({'idUser': idUser})
        if(await Helper.verifyDevicesQuatity(UserDevices.length)){
            if(Helper.verifyDevicesQuatity(UserDevices.length)){
                return res.status(400).send({err: 'max quantity of devices, user can trade one device'})
            }
            return res.status(400).send({err: 'max quantity of devices, you cant trade no one device  until 10/10/2019'})
        }
        await Device.create({idUser, idDevice, nameDevice, modelDevice})
        return res.status(201).send({message: 'Device is create if success'})
    }
        // Trade Device
    async changeDevice(req, res){
        const { idUser, idDevice, nameDevice, modelDevice} = req.body;
        const Devices = await Device.findOne({"idUser": idUser})
        let id = req.params.id;
        let today = moment();
        if(Devices){
            if(Helper.verifyIfUserDontHaveDevicesChange(Devices)){
                Device.updateMany({"idUser": idUser}, {"exchangeable": true})
                if(Helper.verifyDeviceChangeIsExchangeable(Devices)){
                    if(await Device.findOne({"idDevice": id})){
                        await Device.deleteOne({"idDevice": id})
                        await Device.updateMany({"idUser": idUser})
                        await Device.create({idUser, idDevice, nameDevice, modelDevice})
                        return res.status(200).send({message: 'Device is change if success'})
                    }
                    return res.status(400).send({message: 'device is not found!'})
                }
                return res.status(400).send({err:'`the exchange has already been made, can only be realized in date`'})
            }
            return res.status(400).send({err:'the exchange has already been made'})
        }
        return res.status(400).send({message: "device is not found!"})
    }

    async update(req, res){
        let id = req.params.id;
        let {nameDevice} = req.body;
        if(await Device.findOne({"idDevice": id})){
            await Device.updateOne({"idDevice": id}, { $set: {"nameDevice": nameDevice}} )
            return res.status(200).send({message:'Device atualizado com sucesso'})
        }
        return res.status(400).send({error: 'device is not found'});
    }

    async remove(req, res){
        let id = req.params.id;
        const { idUser} = req.body;
        let device = await Device.findOne({"idDevice": id});
        if(device){
                let userDevices = await Device.find({"idUser": idUser})
                if(userDevices.length === 1){
                    return res.status(400).send({error: 'last device can not be removed'})
                }
                if(await Device.findOne({"idDevice": id})){
                    await Device.deleteOne({"idDevice": id})  
                    return res.status(200).send({message: `Device ${id} deletado com sucesso!`})
                }
        }
        return res.status(400).send({error:'device is not found'})
    }
}

module.exports = new DeviceController