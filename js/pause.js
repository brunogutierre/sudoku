function pausar(){
	var divPausa = document.createElement('div');
	var btUnpause = document.createElement('div');
	body = document.getElementById('body');
	tabela = document.getElementById('tabelaSudoku');
	
	divPausa.style.background = '#222';
	divPausa.style.position = 'absolute';
	divPausa.style.zIndex = '1200';
	
	divPausa.style.left = window.pageXOffset + 'px';
	divPausa.style.top = window.pageYOffset + 'px';
	
	divPausa.style.height = window.innerHeight + 'px';
	divPausa.style.width = window.innerWidth + 'px';
	
	window.divPausa = divPausa;
	window.btUnpause = btUnpause;
	body.style.overflow = 'hidden';
	
	tabela.tempo.tempoPause = new Date();
	
	btUnpause.className = 'BtUnpause';
	btUnpause.style.background = 'url(img/unpause.png)';
	btUnpause.style.top = ((window.innerHeight / 2) - 32) + 'px';
	btUnpause.onclick = function(){
		removerPausa();
	}
	
	divPausa.appendChild(btUnpause);
	body.appendChild(divPausa);
	
	window.onresize = function(){
		if (this.divPausa){
			this.divPausa.style.height = window.innerHeight + 'px';
			this.divPausa.style.width = window.innerWidth + 'px';
			
			this.btUnpause.style.top = ((window.innerHeight / 2) - 32) + 'px';
		}
	}
	
	window.onscroll = function(){
		if (this.divPausa){
			this.divPausa.style.height = window.innerHeight + 'px';
			this.divPausa.style.width = window.innerWidth + 'px';
		}
	}
}

function removerPausa(){
	body = document.getElementById('body');
	tabela = document.getElementById('tabelaSudoku');
	tempo = document.getElementById('tdTempo');
	
	data = new Date();
	
	if (tempo.inicio){
		tempo.inicio.setTime(tempo.inicio.getTime() + (data.getTime() - tempo.tempoPause.getTime()));
		tempo.innerHTML = tempo.getTempoFormatado(new Date());
	}
	
	body.style.overflow = 'auto';
	
	if (window.divPausa && window.divPausa.parentNode)
		window.divPausa.parentNode.removeChild(window.divPausa);
		
	window.onresize = null;
	window.onscroll = null;
}