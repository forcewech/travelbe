module.exports = app => {
    var Hoadon = require('../controller/Hoadon');
    var router = require('express').Router();

    router.post("/", Hoadon.create);
    router.get('/', Hoadon.findall);
    router.get('/:id', Hoadon.findone);
    router.delete('/:id', Hoadon.delete);
    router.patch('/:id', Hoadon.update);
    router.get('/thongke/tour', Hoadon.thongke);
    app.use("/hoadons", router);
}