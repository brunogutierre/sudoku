var historicoJogadas = [];

function anotarJogada(x,y,valor,valorAnterior){
	historicoJogadas[historicoJogadas.length] = {
		x : x,
		y : y,
		valor : valor,
		valorAnterior : valorAnterior
	};
}

function voltarJogada(){
	if (historicoJogadas.length > 0){
		jogada = historicoJogadas.pop();
		
		td = document.getElementById('cellSudoku_' + jogada.x + '_' + jogada.y);
		
		if (td){
			td.escreverNumero(jogada.valorAnterior, false, true);
		}
	}
}