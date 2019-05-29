process.env.NODE_ENV = 'test'
let app = require('../app/config/server')
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const device = { 
    idUser: 1,
    idDevice: 1,
    nameDevice: 'xiaomi',
    modelDevice: 'Android'
}


describe('/POST devices', () => {
    it('it should POST a device', (done) => {
      chai.request(app)
          .post('/device')
          .send(device)
          .end((err, res) => {
             res.should.have.status(201);
             
              done()
          });
    });
    it('it should not POST a device in database', (done) => {
        chai.request(app)
            .post('/device')
            .send(device)
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
    })
});
describe('/DELETE devices', () => {
    it('it should not delete a device where quantity is one ', (done) => {
        chai.request(app)
            .delete('/device/1')
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
            
    })
} )
