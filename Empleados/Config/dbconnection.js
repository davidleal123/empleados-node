var config = {
    "user": 'davidleal',
    "password": 'david',
    "server": 'localhost',
    "database": 'Empleados',
    "dialect": "mssql",
    "port": '1444',    
    "dialectOptions": {
        "instanceName": "SQLEXPRESS"
    }
};
function conectionclose(params) {
    var sql= params;
    try{
        sql.close();
        }catch(err){
            console.log(err);
        }
    
}

module.exports={
    config,
    conectionclose
}