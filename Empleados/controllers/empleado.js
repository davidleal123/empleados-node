
var sql = require("mssql");
var Depto = require('../models/empleado.js');
var dbconn = require('../Config/dbconnection.js');
var config = dbconn.config;


//Funcion que me regresa todos los empleados
function getEmpleados(req, res) {
    // connect to your database
    //Metodo dentro de la clase de conexion a base de datos para revisar conexiones abiertas y cerrarlas
    //dbconn.conectionclose();
    sql.close();
    sql.connect(config, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        console.log("Sin errores")        
        request.query("select * from Empleado e inner join Departamento d on e.departamento = d.puesto", function (err, recordset) {
            console.log("Realizo la consulta")
            
            if(err){
                res.status(500).send({message: 'Error al consultar los Empleados'});
            }
            else if(!recordset){
                res.status(404).send({message: 'Error: No existen empleados aun'})
            }
            else{
                res.send({Empleados:recordset.recordset})
                }
        });
    });
}

//Funcion que me regresa todos un empleado en especifico segun su identificador
function getEmpleado(req, res){
    var clave_emp= req.params.id;
    sql.close();
    sql.connect(config, function(err) {
        if(err) console.log(err);

        var request = new sql.Request();

        request.query('select * from Empleado e inner join Departamento d on e.departamento = d.puesto where clave_emp='+clave_emp, function(err, recordset){

            if(err){
                res.status(500).send({message: 'Error al consultar el Empleado seleccionado'});
            }
            else if(!recordset){
                res.status(404).send({message: 'Error: No existe ese empleado'})
            }
            else{
               
                res.send({Empleado:recordset.recordset[0]})
                }
        });
    })
}

function postempleado(req, res){
    sql.close();
    sql.connect(config,(err)=>{
        var request = new sql.Request();    
        const transaction = new sql.Transaction(/* [pool] */)    
        transaction.begin(err => {
            if(err) console.log(err);
                request.query("insert into Empleado values('"+req.body.nombre+"','"+req.body.ApPaterno+"','"+req.body.ApMaterno+"','"+req.body.Fecnac+"','"+req.body.departamento+"','"+req.body.sueldo+"')", (err, recordset) =>{
    
                    if(err){
                        res.status(500).send({message: 'Error al insertar el Empleado seleccionado'});
                    }
                    else
                        res.status(200).send({message: 'Empleado guardado'})
                })

            });
    });    
}

function deleteEmpleado(req, res){
    sql.close();

    sql.connect(config,(err)=>{
        var request = new sql.Request();    
        const transaction = new sql.Transaction(/* [pool] */)    
        transaction.begin(err => {
            if(err) console.log(err);
                request.query("delete from Empleado where clave_emp ='"+req.body.Clave_emp+"'", (err, recordset) =>{
    
                    if(err){
                        res.status(500).send({message: 'No puedes eliminar un departamento que actualmente cuenta con Empelados'});
                    }
                    else
                        res.status(200).send({message: 'Empleado eliminado'});
                })

            });
    });
}

function updateEmpleado(req, res){
    sql.close();

    sql.connect(config,(err)=>{
        if(err) console.log(err);        
        var request = new sql.Request();    
        const transaction = new sql.Transaction(/* [pool] */)    
        transaction.begin(err => {
            if(err) console.log(err);
                request.query("update Empleado set descripcion ='"+req.body.nombre+"', appaterno ='"+req.body.ApPaterno+"',apmaternpo = '"+req.body.apMaterno+"',fecnac= '"+req.body.fecnac+"',departamento ='"+req.body.Departamento+"',sueldo ='"+req.body.sueldo+"'where clave_emp='"+req.body.clave_emp, (err, recordset) =>{
    
                    if(err){
                        res.status(500).send({message: 'Error al actualizar el empleado seleccionado'});
                    }
                    else
                        res.status(200).send({message: 'Empleado actualizado'})
                })

            });
    });

}

module.exports= {
    getEmpleados,
    getEmpleado,
    postempleado,
    updateEmpleado,
    deleteEmpleado
}
