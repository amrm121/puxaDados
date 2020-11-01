const request = require('request');
const prompt = require('prompt-sync')();
const LineByLineReader = require('line-by-line');
const validarCpf = require('validar-cpf');
const fs = require('fs');
const opt = 1; //EDITAR AQUI 1 = PUXA ATÉ CEP /2 PUXA TUDO
function pad(str, length) {
  const resto = length - String(str).length;
  return '0'.repeat(resto > 0 ? resto : '0') + str;
}
function Curl(setCurl) {

	return new Promise((resolve, reject) => {

		request(setCurl, (err, data, resp) => resolve(resp));

	});

}
async function puxaDados( cpf, cookie, opt ){
	 
	cookie = 'sucuri_cloudproxy_uuid_e4e63face=7b700849da71e5e9bc0c0cd1faaaa14f; PHPSESSID=bcfob8hmjg682cj51g5bdgm7aj; __tawkuuid=e::painel.ac::Dc11BEwUxbAhcgTHkbzA8grDHX05w/CxKQAOrD7gL9tcug8mL2+5T7xJctNiINGC::2; TawkConnectionTime=0'
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
				
				//
				//resultado = reqToken.substring( reqToken.lastIndexOf('- DADOS CADASTRAIS'), reqToken.lastIndexOf('- INFORMAÇÕES CARTÓRIO')); <-
				if(opt == 1){
					resultado = reqToken.substring( reqToken.lastIndexOf('- DADOS CADASTRAIS'), reqToken.lastIndexOf('- INFORMAÇÕES CARTÓRIO'));
				}
				else{
					resultado = reqToken.substring( reqToken.lastIndexOf('- DADOS CADASTRAIS'), reqToken.lastIndexOf('>'));
				}
			 	
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
	var optx = 0;
	const  cookie = prompt('Aperte enter depois de ter editado no arquivo o cookie:) APDU.emv');
	const escolha = prompt('EDITE NO ARQUIVO SE VOCÊ QUER PUXADA COMPLETA OU APENAS ATÉ CEP.');
	
	//console.log('Digite 1 se quiser puxar até o CPF e 2 se quiser puxada completa.');
	
	/*lrn.on('line', async function (line) {
		console.log('TESTE 1 OK');
		lrn.pause();
		if(line == 1){
			optx = 1;
			console.log('Puxando dados até CPF. - APDU.emv');
		}else{
			optx = 2;
			console.log('Puxando dados COMPLETOS. - APDU.emv');			
		}
		lrn.close();
	});*/
	
	lr = new LineByLineReader('./lista.txt');

	lr.on('line', async function (line) {
		lr.pause();

		if( validarCpf(line) ){
			if(optx == 1){
				console.log('Puxando dados até CEP. CPF:' + line + ' - APDU.emv \n');
			}
			else{
				console.log('Puxando dados COMPLETOS. CPF:' + line + ' - APDU.emv \n');
			}
			
			
			var retorno = await puxaDados(line, cookie, optx);

			//retorno = pad(retorno, cookie);
			//retorno = pad(retorno.cpf, 11)+','+retorno.nome+','+retorno.data+','+pad(retorno.cep,8)
			//retorno = pad(retorno.cpf, 11)+','+retorno.nome+','+retorno.nasc+','+pad(retorno.cep,8)
			
			fs.appendFile('resultado.txt', retorno+" \n\n | Checker By: APDU.emv $ LaFirma | \n\n", function (err) {
					if (err) return console.log(err);
			});


		}
		

		lr.resume();

	});

};

run();