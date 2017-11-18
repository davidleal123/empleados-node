
var sql = require("mssql");
var Depto = require('../models/Departamento.js');
var dbconn = require('../Config/dbconnection.js');
var config = dbconn.config;


//Funcion que me regresa todos los departamentos
function getDeptos(req, res) {
    // connect to your database
     sql.close();
    sql.connect(config, function (err) {
        console.log("Se conecto")
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('select * from Departamento', function (err, recordset) {

            if(err){
                res.status(500).send({message: 'Error al consultar los Departamentos'});
            }
            else 
            if(!recordset){
                res.status(404).send({message: 'Error: No existen departamentos aun'})
            }else{
                var Dep = recordset.recordset;
            res.send({Departamentos: Dep})
            }
        });
    });
}

//Funcion que me regresa todos un departamento en especifico segun su identificador
function getDepto(req, res){
    var deptoid= req.params.id;
    sql.close();
    sql.connect(config, function(err) {
        if(err) console.log(err);

        var request = new sql.Request();

        request.query('select * from Departamento where puesto='+deptoid, function(err, recordset){

            if(err){
                res.status(500).send({message: 'Error al consultar el Departamento seleccionado'});
            }
            else if(!recordset){
                res.status(404).send({message: 'Error: No existe ese departamento'})
            }else{

                var depto= recordset.recordset[0];
                res.send({Departamento:depto});
                }
        });
    })
}

function postDepto(req, res){
    sql.close();
    sql.connect(config,(err)=>{
        var request = new sql.Request();    
        const transaction = new sql.Transaction(/* [pool] */)    
        transaction.begin(err => {
            if(err) console.log(err);
                request.query("insert into Departamento values('"+req.body.descripcion+"')", (err, recordset) =>{
    
                if(err){
                    res.status(500).send({message: 'Error al insertar el Departamento seleccionado'});
                    console.log(err)
                    
                }
                else
                transaction.begin(err => {
                    
                    res.status(200).send({message: 'Departamento guardadol'})
                })

            });
    });
    });
    
}




function deleteDepto(req, res){
    sql.close();


    sql.connect(config,(err)=>{
        var request = new sql.Request();    
        const transaction = new sql.Transaction(/* [pool] */)    
        transaction.begin(err => {
            if(err) console.log(err);
                request.query("delete from Departamento where puesto ='"+req.body.puesto+"'", (err, recordset) =>{
    
                    if(err){
                        res.status(500).send({message: 'Error al eliminar el Departamento seleccionado'});
                        console.log(err);
                    }
                    else
                        res.status(200).send({message: 'Departamento eliminado'})
                })

            });
    });
    
}

function updateDepto(req, res){
    sql.close();

    sql.connect(config,(err)=>{
        if(err) console.log(err);        
        var request = new sql.Request();    
        const transaction = new sql.Transaction(/* [pool] */)    
        transaction.begin(err => {
            if(err) console.log(err);
                request.query("update Departamento set descripcion = '"+req.body.descripcion+"'where puesto ='"+req.body.puesto+"'", (err, recordset) =>{
    
                    if(err){
                        res.status(500).send({message: 'Error al actualizar el Departamento seleccionado'});
                    }
                    else
                        res.status(200).send({message: 'Departamento actualizado'})
                })

            });
    });
}

module.exports= {
    getDeptos,
    getDepto,
    postDepto,
    updateDepto,
    deleteDepto
}
