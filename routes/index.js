var express = require('express');
var router = express.Router();
var tumama="Iniciar sesion";
var db= require('../models/conexion');
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.mail){
    res.render('index', { title: 'Ingreso',sesion:req.session.mail});
  }else{
  res.render('index', { title: 'Iniciar Sesión' });
  }
});

router.get('/catalogo', function(req, res, next) {

  db.query("select*from 9a",function(err,result){res.render('catalogo',{title:'Catalogo',libros:result});
});
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Iniciar Sesion' });
});
router.get('/agregar', function(req, res, next) {
  res.render('agregar', { title: '' });
});
router.get('/carrito', function(req, res, next) {
  res.render('carrito', { title: 'Iniciar Sesion' });
});
router.get('/indexadmin', function(req, res, next) {
  res.render('indexadmin', { title: 'Index' });
});

router.post('/login', function(req, res, next) {
  req.session.mail=req.body.mail;

  var pagina='<!doctype html><html><head></head><body>'+
             '<p>Se creo la variable de sesión</p>'+
             '<p>Puede ingresar al panel de control:</p>'+
             '<a href="/panel">Ingresar</a><br>'+
             '</body></html>';
  res.send(pagina); 
});
router.get('/panel', function(req, res, next) {
  if (req.session.mail) {
    res.render('index', { title: req.session.mail });
  } else {
    var pagina='<!doctype html><html><head></head><body>'+
             '<p>No tiene permitido ingresar sin login</p>'+
             '<br><a href="/">Retornar</a></body></html>';
    res.send(pagina);        
  }
});
router.get('/logout', function(req, res, next) {
  req.session.destroy();
  var pagina='<!doctype html><html><head></head><body>'+
           '<br><a href="/">Retornar</a></body></html>';
  res.send(pagina);
});
router.post('/add_cart', function (req, res) { 
       
  if (req.session.cart== null) {
    req.session.cart=[];
  } 
    req.session.cart.push(req.body.id); 
    console.log(req.session.cart)  ;
    res.redirect('/catalogo');


});
router.get('/view_cart', function(req, res, next) {

  var myproducts=[];
  req.session.mycart=[];
  req.session.cart.forEach(function(i, idx, array){
    db.query("SELECT * FROM 9a where id="+i, function(err,results){ 
    myproducts.push((results[0]));
     console.log(results[0]);
     console.log("sssssssssssssssssssss");
    console.log(results);
    console.log("sssssssssssssssssssss");
    console.log(myproducts); 
     console.log("next");
      
     if (idx === array.length - 1){ 
       req.session.mycart=myproducts;
       res.render('view_cart', { title: 'Productos', Libros:myproducts}); 
   }
    });
  }); 

  
  
}); 
router.post('/delete_from_array', function (req, res) { 
       
          
  req.session.mycart.splice(parseInt(req.body.id), 1); 
  req.session.cart.splice(parseInt(req.body.id), 1); 
  res.redirect('/view_cart');

});
router.post('/last_confirmation', function (req, res) { 
  
  
      var moment = require('moment');

db.query("Insert into orders (products, totalPrice, created_at, user_id, isCompleted) VALUES ('"+req.session.cart+"','"+req.body.amount+"','"+new Date()+"','"+1+"','0')", 
function (err, result) {
if (err) throw err;
res.render('last_confirmation', { title: 'Ultima confirmación', message:'Confirma tu compra', total:req.body.amount });

 }
); 
     






});
module.exports = router;
