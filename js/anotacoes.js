var body = null;

function calcPosAnotacao(centro_x, centro_y, raio, total, pos){
	cxf = centro_x + (raio * Math.cos((Math.PI / 2) - (Math.PI * 2/total * pos)));
	cyf = centro_y - (raio * Math.sin((Math.PI / 2) - (Math.PI * 2/total * pos)));
	
	return { x : cxf, y : cyf};
}

function gerarAnotacoes(td){
	for (var i = 0; i < 9; i++){
		div = document.createElement('div');
		div.className = 'DivAnotacao';

		div.appendChild(document.createTextNode(i + 1));
		
		div.codigo = i + 1;
		div.td = td;
		
		td_size = 42;
		div_size = 14;
		
		div.style.position = 'absolute';
		
		pos = calcPosAnotacao(td.offsetLeft + td.parentNode.parentNode.parentNode.offsetLeft + (td_size / 2), td.offsetTop + td.parentNode.parentNode.parentNode.offsetTop + (td_size / 2), (td_size + 8) / 2, 9, i);
		
		div.style.left = (Math.floor(pos.x) + 1 - (div_size / 2)) + 'px';
		div.style.top = (Math.floor(pos.y) + 1 - (div_size / 2)) + 'px';
		
		body.appendChild(div);
		td.divs[td.divs.length] = div;
	}
	
	document.divs = td.divs;
	
	if (td.vermelhos){
		for (var i = 0; i < td.vermelhos.length; i++){
			for (var l = 0; l < td.divs.length; l++){
				if (td.vermelhos[i] == td.divs[l].codigo){
					td.divs[l].style.background = '#FAA';
					td.divs[l].vermelho = true;
				}
			}
		}
	}
}

function calcAnotacoes(td){
	numLin = td.tabela.getLinha(td.y);
	numCol = td.tabela.getColuna(td.x);
	numBlo = td.tabela.getBloco(td.b);
	
	numeros = [0,0,0,0,0,0,0,0,0];
	vermelhos = [];
	
	for (var m = 0; m < 9; m++){
		if (m != td.x && numLin[m]){
			numeros[numLin[m] - 1]++;
		}
		if (m != td.y && numCol[m]){
			numeros[numCol[m] - 1]++;
		}
		if (m != ((td.x % 3) + (3 * (td.y % 3))) && numBlo[m]){
			numeros[numBlo[m] - 1]++;
		}
	}
	
	for (var m = 0; m < 9; m++){
		if (numeros[m] > 0)
			vermelhos[vermelhos.length] = m + 1;
	}
	
	td.vermelhos = vermelhos;
}

function removerAnotacoes(td){
	document.divs = [];
	
	if (td.divs){
		for (var i = 0; i < td.divs.length; i++){
			body.removeChild(td.divs[i]);
		}
	}
}

function mostrarRespostasFaceis(){
	var tabela = document.getElementById('tabelaSudoku');
	finalizaProcura = false;
	
	while (!finalizaProcura){
		finalizaProcura = true;
		
		for (var i = 0; i < tabela.rows.length; i++){
			for (var l = 0; l < tabela.rows[i].cells.length; l++){
			
				if (i == 0 && l == 0){
					atualizarVermelhosCompleto();
				}
				
				if (!tabela.rows[i].cells[l].valorTentado){
					if (tabela.rows[i].cells[l].vermelhos.length == 8){
						sum = 45;
						
						for (m = 0; m < 8; m++)
							sum -= tabela.rows[i].cells[l].vermelhos[m];
						
						if (sum > 0 && sum < 10){
							tabela.rows[i].cells[l].escreverNumero(sum + '');
							i = 9;
							l = 9;
							finalizaProcura = false;
						}
					}
					
					else if (tabela.rows[i].cells[l].vermelhos.length < 8) {
						bloco = Math.floor(l / 3) + (3 * Math.floor(i / 3));
						posValores = inverterListaPossibilidades(tabela.rows[i].cells[l].vermelhos);
						
						for (var k = 0; k < posValores.length; k++){
							pVerticais = [];
							pHorizontais = [];
							pBloco = [];
						
							for (var m = 0; m < 9; m++){
								//linha
								if (m != l && !tabela.rows[i].cells[m].valorTentado){
									if (!verificarLista(tabela.rows[i].cells[m].vermelhos, posValores[k])){
										pHorizontais[pHorizontais.length] = m;
									}
								}
								
								//coluna
								if (m != i && !tabela.rows[m].cells[l].valorTentado){
									if (!verificarLista(tabela.rows[m].cells[l].vermelhos, posValores[k])){
										pVerticais[pVerticais.length] = m;
									}
								}
								
								//bloco
								if ((m != ((l % 3) + Math.floor(i / 3))) && (!tabela.rows[((Math.floor(m / 3.0)) + (Math.floor(bloco / 3.0) * 3))].cells[((m % 3) + ((bloco % 3) * 3))].valorTentado)){
									if (!verificarLista(tabela.rows[((Math.floor(m / 3.0)) + (Math.floor(bloco / 3.0) * 3))].cells[((m % 3) + ((bloco % 3) * 3))].vermelhos, posValores[k])){
										pBloco[pBloco.length] = m;
									}
								}
							}
							

							if (pVerticais.length == 0 || pHorizontais.length == 0 || pBloco.length == 0){
								tabela.rows[i].cells[l].escreverNumero(posValores[k] + '');
								i = 9;
								l = 9;
								
								finalizaProcura = false;
								break;
							}
						}
					}
				}
				
				if (l == 9)
					break;
			}
			
			if (i == 9)
				break;
		}
	}
}

function inverterListaPossibilidades(lista){
	inverso = [];
	
	for (var i = 1; i < 10; i++){
		encontrado = false;
		
		for (var l = 0; l < lista.length; l++){
			if (lista[l] == i){
				encontrado = true;
				break;
			}
		}
		
		if (!encontrado)
			inverso[inverso.length] = i;
	}
	
	return inverso;
}

function atualizarVermelhosCompleto(){
	var tabela = document.getElementById('tabelaSudoku');
	
	for (var m = 0; m < tabela.rows.length; m++){
		for (var n = 0; n < tabela.rows[m].cells.length; n++){
			calcAnotacoes(tabela.rows[m].cells[n]);
		}
	}
}

function verificarLista(lista, numero){
	for (var i = 0; i < lista.length; i++){
		if (lista[i] == numero)
			return true;
	}
	
	return false;
}

function initAnotacoes(){
	body = document.getElementById('body');
	var tabela = document.getElementById('tabelaSudoku');
	
	if (tabela){
		for (var i = 0; i < tabela.rows.length; i++){
			for (var l = 0; l <tabela.rows[i].cells.length; l++){
				td = tabela.rows[i].cells[l];
				td.divs = [];
				td.vermelhos = [];
				
				td.onmouseover = function(){
					if (this.fixo || this.tabela.travado || this.tabela.dificuldade == 3 || this.isEditing)
						return;
					
					if (this.tabela.dificuldade == 0)
						calcAnotacoes(this);
					
					gerarAnotacoes(this);
				
					this.onmouseout = function(){
						removerAnotacoes(this);
						this.divs = [];
					}
				}
			}
		}
	}
	
	document.onkeypress = function(event){
		tecla = String.fromCharCode(event.which);
		
		if (tabela.dificuldade == 0)
			return;
			
		if (document.divs){
			if (tecla.match('^[1-9]$')){
				for (var i = 0; i < document.divs.length; i++){
					if (tecla == document.divs[i].codigo){
						if (document.divs[i].vermelho){
							document.divs[i].style.background = '#FFF';
							document.divs[i].vermelho = false;
							
							for (var l = 0; l < document.divs[i].td.vermelhos.length; l++){
								if (document.divs[i].td.vermelhos[l] == tecla){
									document.divs[i].td.vermelhos.splice(l, 1);
									break;
								}
							}
						}
						else {
							document.divs[i].style.background = '#FAA';
							document.divs[i].vermelho = true;
							document.divs[i].td.vermelhos[document.divs[i].td.vermelhos.length] = tecla;
						}
					}
				}
			}
			else if (tecla == '-' || tecla == '+'){
				for (var i = 0; i < document.divs.length; i++){
					if (tecla == '-'){
						if (i == 0)
							document.divs[i].td.vermelhos = [];
							
						document.divs[i].style.background = '#FFF';
						document.divs[i].vermelho = false;
					}
					else {
						if (i == 0)
							document.divs[i].td.vermelhos = ['1','2','3','4','5','6','7','8','9'];
							
						document.divs[i].style.background = '#FAA';
						document.divs[i].vermelho = true;
					}
				}
			}
			else if (event.shiftKey && !event.ctrlKey){
				if (tecla == '*'){
					calcAnotacoes(document.divs[0].td);
				}
			}
		}
		
		if (event.shiftKey){
			if (tecla == '"' || tecla == '!' || tecla == '-' || tecla == '+'){
				
				for (var i = 0; i < tabela.rows.length; i++){
					for (var l = 0; l < tabela.rows[i].cells.length; l++){
						if (tecla == '"'){
							calcAnotacoes(tabela.rows[i].cells[l]);
						}
						else if (tecla == '-'){
							tabela.rows[i].cells[l].vermelhos = [];
						}
						else if (tecla == '+'){
							tabela.rows[i].cells[l].vermelhos = ['1','2','3','4','5','6','7','8','9'];
						}
					}
				}
			}
		}
	}
	
	document.onkeyup = function(event){
		tecla = String.fromCharCode(event.which);
		
		if (verificarKonami){
			verificarKonami(event.which);
		}
		
		if (event.ctrlKey){		
			if (tecla.toLowerCase() == 'z'){
				if (voltarJogada){
					voltarJogada();
				}
			}
		}
	}
}