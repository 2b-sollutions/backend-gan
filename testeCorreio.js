var soap = require('soap');
var url = 'https://apphom.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl';
soap.createClient(url, function(err, client) {
    if(err) return console.log(err);
    console.log(client.AtendeClienteService);
});