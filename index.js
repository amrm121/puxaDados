const request = require('request');
const prompt = require('prompt-sync')();
const LineByLineReader = require('line-by-line');
const validarCpf = require('validar-cpf');
const fs = require('fs');
function pad(str, length) {
  const resto = length - String(str).length;
  return '0'.repeat(resto > 0 ? resto : '0') + str;
}
function Curl(setCurl) {

	return new Promise((resolve, reject) => {

		request(setCurl, (err, data, resp) => resolve(resp));

	});

}
async function puxaDados( cpf, cookie ){
	
	cookie = 'sucuri_cloudproxy_uuid_205e2b585=3a0e7d62edbf8a4db683c0b3587047a4; PHPSESSID=i1kj2uja1hfliapo1g35lnnv9f; __tawkuuid=e::painel.ac::JDO5WAN4zSHpaxfIB3t+EvuGxB24D78ubSHJ2nzzlC18RoeH4VGLM+C9OVLObR/S::2; TawkConnectionTime=0sucuri_cloudproxy_uuid_205e2b585=3a0e7d62edbf8a4db683c0b3587047a4; PHPSESSID=i1kj2uja1hfliapo1g35lnnv9f; __tawkuuid=e::painel.ac::JDO5WAN4zSHpaxfIB3t+EvuGxB24D78ubSHJ2nzzlC18RoeH4VGLM+C9OVLObR/S::2; TawkConnectionTime=0';
	var respPuxaDados;
	
	while( true ){

		try{

			let reqToken = await Curl({

				url:'https://painel.ac/root/modules/Complete/BuscarDocumento.php',
				method:'POST',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.189',
					'Referer': 'https://painel.ac/Complete.php',
					'Cookie': cookie,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				form: {
					'cpf': cpf,
					'titulo': '',
					'rg' : '',
					'cnh'  : ''
				}

			});
			//console.log(reqToken);
				await(8000);
			 	resultado = reqToken.substring( reqToken.lastIndexOf('resultado_clipboard'));
			 	console.log('\nAPDU.emv$LaFirma -- Dados Coleta OK:');
			 	console.log('APDU.emv$LaFirma -- Dados CPF:' + cpf);
			 	//cpf = resultado.substring( resultado.indexOf('(CPF):'+2), resultado.indexOf('(CPF):')+13);
			 	//nome = resultado.substring((resultado.indexOf('Nome')+1),(resultado.indexOf('M')-1);	
			 	
			 	//nasc = resultado.substring( resultado.indexOf('Nascimento')+1, resultado.indexOf('Nascimento')+11);
			 	//cep = resultado.substring( resultado.indexOf('CEP')+1, resultado.indexOf('CEP')+8);
			 	//respPuxaDados = { cpf : cpf , nome : nome, nasc : nasc, cep : cep}
			 	return resultado;
				break;		 
			
			//console.log(cpf);
			
			
		}catch(erro){
			
			console.log(erro);
			console.log('Erro na consulta dos dados...');
			continue;

		} // try

	} // while( true )
	
	return respPuxaDados;	

} // async function puxaDados


var run = async () => {

	const  cookie = prompt('Insira o cookie do proleão: ');

	lr = new LineByLineReader('./lista.txt');

	lr.on('line', async function (line) {

		lr.pause();

		if( validarCpf(line) ){

			var retorno = await puxaDados(line, cookie);

			//retorno = pad(retorno, cookie);
			//retorno = pad(retorno.cpf, 11)+','+retorno.nome+','+retorno.data+','+pad(retorno.cep,8)
			//retorno = pad(retorno.cpf, 11)+','+retorno.nome+','+retorno.nasc+','+pad(retorno.cep,8)
			//console.log(retorno);
			fs.appendFile('resultado.txt', retorno+" \n\n | Checker By: APDU.emv $ LaFirma | \n\n", function (err) {
					if (err) return console.log(err);
			});


		}
		

		lr.resume();

	});

};

run();