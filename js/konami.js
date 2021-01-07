var konamiSequence = [38,38,40,40,37,39,37,39,66,65,13];
var sequenciaEntrada = [];

function verificarKonami(cod){
	if (konamiSequence[sequenciaEntrada.length] == cod){
		sequenciaEntrada[sequenciaEntrada.length] = cod;
		
		if (konamiSequence.length == sequenciaEntrada.length){
			valido = true;
			
			for (var i = 0; i < konamiSequence.length; i++){
				if (konamiSequence[i] != sequenciaEntrada[i])
					valido = false;
			}
			
			sequenciaEntrada = [];
			
			if (valido)
				animacaoCombo();
		}
	}
	else {
		if (cod == 38 && sequenciaEntrada[sequenciaEntrada.length - 1] == 38)
			sequenciaEntrada = [38,38];
		else if (cod == 38)
			sequenciaEntrada = [38];
		else
			sequenciaEntrada = [];
	}
}

function animacaoCombo(){
	centro = window.innerHeight / 2;
	body = document.getElementById('body');
	divPrincipal = document.createElement('div');
	
	divPrincipal.style.background = 'black';
	divPrincipal.style.width = '200%';
	divPrincipal.style.height = '80px';
	divPrincipal.style.position = 'absolute';
	divPrincipal.style.color = 'white';
	divPrincipal.style.fontSize = '60px';
	divPrincipal.style.fontWeight = 'bolder';
	divPrincipal.style.paddingTop = '10px';
	divPrincipal.style.paddingLeft = '0px';
	divPrincipal.style.fontFamily = 'Helvetica';
	
	divPrincipal.style.left = (-200 - (800 - (window.innerWidth/2))) + 'px';
	divPrincipal.style.top = (centro - 50) + 'px';
	
	divPrincipal.divs = [];
	numDivs = parseInt((Math.random() * 10) + 5);
	
	divPrincipal.appendChild(document.createTextNode('COMBO BREAKER!!'));
	
	for (var i = 0; i < numDivs; i++){
		divPrincipal.divs[divPrincipal.divs.length] = document.createElement('div');
		
		divPrincipal.divs[divPrincipal.divs.length - 1].style.height = parseInt(3 + (Math.random() * 3)) + 'px';
		divPrincipal.divs[divPrincipal.divs.length - 1].style.width = parseInt(100 + (Math.random() * 1000)) + 'px';
		divPrincipal.divs[divPrincipal.divs.length - 1].style.top = parseInt(parseInt(divPrincipal.style.top.substring(0, divPrincipal.style.top.length - 2)) + 45 + ([-1,1][parseInt(Math.random() + 0.5)] * (40 + (Math.random() * 20)))) + 'px';
		divPrincipal.divs[divPrincipal.divs.length - 1].style.left = parseInt(-1500 + (Math.random() * 1000)) + 'px';
		divPrincipal.divs[divPrincipal.divs.length - 1].velocidade = parseInt(5 + (Math.random() * 20));
		divPrincipal.divs[divPrincipal.divs.length - 1].style.background = '#1B1B1B';
		divPrincipal.divs[divPrincipal.divs.length - 1].style.position = 'absolute';
		
		body.appendChild(divPrincipal.divs[divPrincipal.divs.length - 1]);
	}
	
	body.appendChild(divPrincipal);
	
	body.divPrincipal = divPrincipal;
	body.divPrincipal.rep = 0;
	body.style.overflow = 'hidden';
	
	body.divPrincipal.calcPosTexto = function(percRep){
		return parseInt(Math.abs(percRep) * 15);
	};
	
	body.divPrincipal.codInterval = setInterval(function(){
		body.divPrincipal.rep++;
		
		body.divPrincipal.style.paddingLeft = (parseInt(body.divPrincipal.style.paddingLeft.substring(0, body.divPrincipal.style.paddingLeft.length - 2)) + body.divPrincipal.calcPosTexto((body.divPrincipal.rep - 100) / 100)) + 'px';
		//body.temp = (parseInt(body.divPrincipal.style.paddingLeft.substring(0, body.divPrincipal.style.paddingLeft.length - 2)) + body.divPrincipal.calcPosTexto((body.divPrincipal.rep - 100) / 100)) + 'px';
		
		for (var i = 0; i < body.divPrincipal.divs.length; i++)
			body.divPrincipal.divs[i].style.left = (parseInt(body.divPrincipal.divs[i].style.left.substring(0, body.divPrincipal.divs[i].style.left.length - 2)) + body.divPrincipal.divs[i].velocidade) + 'px';
		
		if (body.divPrincipal.rep >= 200){
			body.style.overflow = 'auto';
			mostrarRespostasFaceis();
			clearInterval(body.divPrincipal.codInterval);
			
			for (var i = 0; i < body.divPrincipal.divs.length; i++)
				body.removeChild(body.divPrincipal.divs[i]);
			
			body.removeChild(body.divPrincipal);
		}
	}, 20);
}