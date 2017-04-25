const app = require('express').Router();
const models = require('../models').models;

module.exports = app;

app.post('/:orderId', (req, res, next) => {
    console.log('req.body', req.body);
    models.Order.findById(req.params.orderId)
    .then( order => {
        models.OrderLine.create({ qty: req.body.qty, productId: req.body.productId, orderId: order.id })
    })
    .then( result => console.log(result))

});

app.delete('/:orderId/:productId', (req, res, next) => {
    const productId = req.params.productId;
    console.log('productId', productId)

    models.OrderLine.destroy({where: { productId: req.params.productId, orderId: req.params.orderId }})
    .then( result => {
        return models.Order.findAll(
            {
                where: { id: req.params.orderId },
                include: [
                    { model: models.OrderLine,
                      include: [{ model: models.Product }]
                    }
                ]
            })
    })
    .then( updatedOrder => {
        console.log('updatedOrder', updatedOrder)
        res.send(updatedOrder)
    })
    .catch(next)
});


app.get('/:orderId', (req, res, next) => {
    models.Order.findAll(
    {
        where: { id: req.params.orderId },
        include: [
            { model: models.OrderLine,
              include: [{ model: models.Product }]
            }
        ]
    })
    .then( order => {
      res.send(order);
    })
    .catch(next);
});
