function init(){
  var tabela = document.getElementById('tabelaSudoku');
  tabela.className = 'TabelaSudoku';

  tabela.campoEntrada = document.createElement('input');
  tabela.campoEntrada.className = 'InputSudoku';
  tabela.campoEntrada.maxLength = 1;
  tabela.campoEntrada.tabela = tabela;
  tabela.campoEntrada.style.border = '0px';

  tabela.travado = true;

  tabela.campoEntrada.close = function(){
    if (this.parentNode){
			this.parentNode.isEditing = false;
			
      if (this.value.match('^[1-9]$') || this.value == ' '){
        this.parentNode.escreverNumero(this.value);
        this.tabela.status.mudaStatus(this.tabela.validaFim());
      }
    }

    this.value = '';
  }

  tabela.validaFim = function(){
    var vitoria = 1;

    for (var i = 0; i < 9; i++){
      var linha = this.getLinha(i);

      if (!this.conjuntoCompleto(linha))
        return 0;
      else if (!this.naoRepetidas(linha))
        vitoria = 0;

      var coluna = this.getColuna(i);

      if (!this.conjuntoCompleto(coluna))
        return 0;
      else if (!this.naoRepetidas(coluna))
        vitoria = 0;

      var bloco = this.getBloco(i);

      if (!this.conjuntoCompleto(bloco))
        return 0;
      else if (!this.naoRepetidas(bloco))
        vitoria = 0;
    }

    return vitoria + 1;
  }

  tabela.conjuntoCompleto = function(valores){
    if (valores.length == 9){
      for (var i = 0; i < valores.length; i++){
        if (!valores[i].match('^[1-9]$'))
          return false;
      }

      return true;
    }

    return false;
  }

  tabela.naoRepetidas = function(valores){
    if (valores.length == 9){
      grade = [0,0,0,0,0,0,0,0,0];

      for (var i = 0; i < valores.length; i++)
        grade[valores[i] - 1] = grade[valores[i] - 1] + 1;
      for (var l = 0; l < grade.length; l++){
        if (grade[l] != 1)
          return false;
      }

      return true;
    }

    return false;
  }

  if (tabela){
    for (var i = 0; i < 9; i++){
      var row = tabela.insertRow(tabela.rows.length);

      for (var l = 0; l < 9; l++){
        var cell = row.insertCell(row.cells.length);

        cell.valorVerdadeiro = '';
        cell.valorTentado = '';

        cell.x = l;
        cell.y = i;
				cell.b = Math.floor(l / 3) + (3 * Math.floor(i / 3));
        cell.campoEntrada = tabela.campoEntrada;
        cell.tabela = tabela;
        cell.id = 'cellSudoku_' + l + '_' + i;
        cell.appendChild(document.createTextNode(''));

        if (l == 0 || l == 3 || l == 6)
          cell.style.borderLeft = '2px solid black';
        if (l == 2 || l == 5 || l == 8)
          cell.style.borderRight = '2px solid black';
        if (i == 0 || i == 3 || i == 6)
          cell.style.borderTop = '2px solid black';
        if (i == 2 || i == 5 || i == 8)
          cell.style.borderBottom = '2px solid black';

        if (Math.abs(i - l) % 2 == 0)
          cell.style.backgroundColor = '#EEE'

        cell.clean = function(){
          while (this.hasChildNodes())
            this.removeChild(this.firstChild);
        }

        cell.escreverNumero = function(num, isFixo, naoAnotar){
					if (!naoAnotar && anotarJogada && !isFixo){
						anotarJogada(this.x, this.y, num + '', this.valorTentado)
					}
					
          this.clean();
          this.appendChild(document.createTextNode(num));
					this.valorTentado = num + '';

          if (isFixo){
            this.fixo = true;
            //this.style.color = '#006600';
						this.style.color = '#990000';
          }
        }

        cell.onclick = function(){
          if (this.tabela.travado || this.fixo)
            return;
          
          if (this.campoEntrada.close)
            this.campoEntrada.close();

          this.clean();
          this.appendChild(this.campoEntrada);
          this.campoEntrada.focus();
					this.isEditing = true;
					
					if (this.onmouseout)
						this.onmouseout();

          this.campoEntrada.onkeyup = function(){
            if (this.value.length == 1 && (this.value.match('^[1-9]$') || this.value == ' ')){							
              this.close();
						}
          }
        }
      }
    }

    tabela.getLinha = function(num, verdadeiro){
      var valores = [];

      for (var i = 0; i < 9; i++){
        var cell = document.getElementById('cellSudoku_' + i + '_' + num);

        if (verdadeiro)
          valores[valores.length] = cell.valorVerdadeiro;
        else
          valores[valores.length] = cell.valorTentado;
      }

      return valores;
    }

    tabela.getColuna = function(num, verdadeiro){
      var valores = [];

      for (var i = 0; i < 9; i++){
        var cell = document.getElementById('cellSudoku_' + num + '_' + i);

        if (verdadeiro)
          valores[valores.length] = cell.valorVerdadeiro;
        else
          valores[valores.length] = cell.valorTentado;
      }

      return valores;
    }

    tabela.getBloco = function(num, verdadeiro){
      var valores = [];

      for (var i = 0; i < 9; i++){
        var cell = document.getElementById('cellSudoku_' + ((i % 3) + ((num % 3) * 3)) + '_' + ((Math.floor(i / 3.0)) + (Math.floor(num / 3.0) * 3)));

        if (verdadeiro)
          valores[valores.length] = cell.valorVerdadeiro;
        else
          valores[valores.length] = cell.valorTentado;
      }

      return valores;
    }

    tabela.clear = function(){
      this.travado = null;

      for (var i = 0; i < this.rows.length; i++){
        for (var l = 0; l < this.rows[i].cells.length; l++){
          this.rows[i].cells[l].escreverNumero('');
          this.rows[i].cells[l].fixo = null;
          this.rows[i].cells[l].style.color = '#000000';
					this.rows[i].cells[l].vermelhos = [];

          this.status.mudaStatus(-1);
        }
      }
    }
  }

  var status = document.getElementById('tdStatus');
  var textoStatus = document.getElementById('tdTextoStatus');
  var tempo = document.getElementById('tdTempo');

  tabela.status = status;
  tabela.tempo = tempo;

  status.tabela = tabela;
  tempo.tabela = tabela;

  var iconeStatus = document.createElement('div');
  var texto = document.createTextNode('Pré Jogo');

  iconeStatus.className = 'IconeStatus';

  status.iconeStatus = iconeStatus;
  status.textoStatus = textoStatus;
  tempo.status = status;
  status.appendChild(iconeStatus);

  textoStatus.texto = texto;
  textoStatus.appendChild(texto);
  
  status.mudaStatus = function(novoStatus){
    if (novoStatus == -1){ //pre jogo
      this.textoStatus.innerHTML = 'Pré Jogo';
      this.iconeStatus.style.backgroundColor = 'white';
      this.tabela.tempo.resetaTempo();

      this.tabela.travado = false;
    }
    else if (novoStatus == 0){ //em jogo
      this.textoStatus.innerHTML = 'Em Jogo';
      this.iconeStatus.style.backgroundColor = 'yellow';

      this.tabela.travado = false;
    }
    else if (novoStatus == 1){ //jogo errado
      this.textoStatus.innerHTML = 'Errado';
      this.iconeStatus.style.backgroundColor = 'red';

      this.tabela.travado = false;
    }
    else if (novoStatus == 2){ //jogo correto
      this.textoStatus.innerHTML = 'Completo';
      this.iconeStatus.style.backgroundColor = 'green';
      this.tabela.tempo.paraTempo();

      this.tabela.travado = true;
    }
  }

  tempo.appendChild(document.createTextNode('00:00:00'));

  tempo.getTempoFormatado = function(date){
    if (this.inicio){
      difSec = date.getSeconds() - this.inicio.getSeconds();
      difMin = date.getMinutes() - this.inicio.getMinutes();
      difHor = date.getHours() - this.inicio.getHours();

      if (difSec < 0){
        difSec += 60;
        difMin -= 1;
      }
      if (difMin < 0){
        difMin += 60;
        difHor -= 1;
      }

      return ((difHor < 10)? '0' + difHor : difHor) + ':' + ((difMin < 10)? '0' + difMin : difMin) + ':' + ((difSec < 10)? '0' + difSec : difSec);
    }

    return '00:00:00';
  }

  tempo.iniciaTempo = function(){
    this.inicio = new Date();
    this.status.mudaStatus(0);

    this.codInterval = setInterval(function(){
      var tempo = document.getElementById('tdTempo');
      var relogio = new Date();

      tempo.innerHTML = tempo.getTempoFormatado(relogio);
    }, 250);
  }

  tempo.paraTempo = function(){
    if (this.codInterval){
      clearInterval(this.codInterval);
      this.codInterval = null;
    }

    this.inicio = null;
  }

  tempo.resetaTempo = function(){
    this.paraTempo();
    this.innerHTML = '00:00:00';
  }

  //jogo = getJogo(0);

  var imgFac = document.getElementById('imgFac');
  var imgMed = document.getElementById('imgMed');
  var imgDif = document.getElementById('imgDif');
  var imgImp = document.getElementById('imgImp');
	
	imgFac.style.cursor = 'pointer';
  imgMed.style.cursor = 'pointer';
  imgDif.style.cursor = 'pointer';
  imgImp.style.cursor = 'pointer';
  
  imgFac.tabela = tabela;
  imgMed.tabela = tabela;
  imgDif.tabela = tabela;
  imgImp.tabela = tabela;
  
  tabela.imgFac = imgFac;
  tabela.imgMed = imgMed;
  tabela.imgDif = imgDif;
  tabela.imgImp = imgImp;
  
  tabela.restartImagens = function(){
    this.imgFac.src = 'img/facil_des.png';
    this.imgMed.src = 'img/normal_des.png';
    this.imgDif.src = 'img/dificil_des.png';
    this.imgImp.src = 'img/impossivel_des.png';
  }

  imgFac.onclick = function(){
    this.tabela.restartImagens();
		this.tabela.dificuldade = 0;

    this.src = 'img/facil.png';
    iniJogo(getJogo(0));
  }

  imgMed.onclick = function(){
    this.tabela.restartImagens();
		this.tabela.dificuldade = 1;

    this.src = 'img/normal.png';
    iniJogo(getJogo(1));
  }

  imgDif.onclick = function(){
    this.tabela.restartImagens();
		this.tabela.dificuldade = 2;

    this.src = 'img/dificil.png';
    iniJogo(getJogo(2));
  }

  imgImp.onclick = function(){
    this.tabela.restartImagens();
		this.tabela.dificuldade = 3;

    this.src = 'img/impossivel.png';
    iniJogo(getJogo(3));
  }
	
	var imgPause = document.getElementById('imgPause');
	imgPause.style.cursor = 'pointer';
	
	imgPause.onclick = function(){
		if (pausar)
			pausar();
	};
	
	if (initAnotacoes)
		initAnotacoes();
}

function iniJogo(jogo){
  var tabela = document.getElementById('tabelaSudoku');
  tabela.clear();
	
	if (historicoJogadas)
		historicoJogadas = [];
  
  for (var n = 0; n < jogo.length; n++){
    if (jogo[n] != -1){
      cell = document.getElementById('cellSudoku_' + (n % 9) + '_' + Math.floor(n/9));
      cell.escreverNumero(jogo[n] + 1, true);
    }
  }
  
  tabela.tempo.iniciaTempo();
}

function getJogo(dif){
  if (dif == 0){
    return jogos_faceis[Math.floor(Math.random() * jogos_faceis.length)][1];
  }
  else if (dif == 1){
    return jogos_medios[Math.floor(Math.random() * jogos_medios.length)][1];
  }
  else if (dif == 2){
    return jogos_dificeis[Math.floor(Math.random() * jogos_dificeis.length)][1];
  }
  else {
    return jogos_desafios[Math.floor(Math.random() * jogos_desafios.length)][1];
  }
}

function doLog(objeto){
  var tabela = document.getElementById('tabelaSudoku');

   if (!tabela.log)
     tabela.log = [];

   tabela.log[tabela.log.length] = objeto;
}