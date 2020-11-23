var http = require('http')
var axios = require('axios')
var fs = require('fs')

var {parse} = require('querystring')

// Funções auxiliares

function recuperaInfo(request, callback){
    if(request.headers['content-type']== 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

// POST Confirmation HTML Page Template -------------------------------------
function geraPostConfirm( aluno, d){
    return `
    <html>
    <head>
        <title>POST receipt: ${aluno.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${aluno.id} inserido</h1>
            </header>

            <div class="w3-container">
                <p><a href="/tarefa/${aluno.id}">Aceda aqui à sua página."</a></p>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::PRI2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

// Template para a página com a lista de alunos ------------------
function geraPagAlunos( lista, d){
  let pagHTML = `
    <html>
        <head>
            <title>Lista de Tarefas</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
        </table>
        <div class="w3-container w3-teal">
        <h2>Registo de Tarefa</h2>
    </div>

    <form class="w3-container" action="/tarefas" method="POST">
        <label class="w3-text-teal"><b>Descrição</b></label>
        <input class="w3-input w3-border w3-light-grey" type="text" name="descricao">
  
        <label class="w3-text-teal"><b>Responsável</b></label>
        <input class="w3-input w3-border w3-light-grey" type="text" name="responsavel">

        <label class="w3-text-teal"><b>Data Limite</b></label>
        <input class="w3-input w3-border w3-light-grey" type="text" name="data">
  
        <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
        <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
    </form>

            <div class="w3-container w3-teal">
                <h2>Lista de Alunos</h2>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th>Descrição</th>
                    <th>Responsável</th>
                    <th>Data Limite</th>
                </tr>
  `
  lista.forEach(a => {
      pagHTML += `
      <tr>
      <form class="w3-container" action="/tarefas/${a.id}" method="POST">
        <input type="hidden" name="_method" value="put" />
        <td type="text" name="descricao"><a href="/tarefas/${a.id}">${a.descricao}</a></td>
        <td type="text" name="responsavel">${a.responsavel}</td>
        <td type="text" name="data">${a.data}</td>
        <td>
            <button class="w3-btn w3-blue-grey" type="submit" value="1" name="tipo">Finalizar</button>
        </td>
        </form>
      </tr>
      `
  });
  pagHTML += `
        
        <div class="w3-container w3-teal">
            <address>Gerado por galuno::PRI2020 em ${d} --------------</address>
        </div>
    </body>
    </html>
  `
  return pagHTML
}

// Template para a página de aluno -------------------------------------
function geraPagAluno( aluno, d ){
    return `
    <html>
    <head>
        <title>Tarefa: ${aluno.id}</title>
        <meta charset="utf-8"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${aluno.id}</h1>
            </header>

            <div class="w3-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                    <li><b>Descrição: </b> ${aluno.descricao}</li>
                    <li><b>Responsável: </b> ${aluno.responsavel}</li>
                    <li><b>Data Limite: </b> ${aluno.data}</li>
                </ul>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::PRI2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}


// Criação do servidor

var galunoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    switch(req.method){
        case "GET": 
            // GET /alunos --------------------------------------------------------------------
            if((req.url == "/") || (req.url == "/tarefas")){
                axios.get("http://localhost:3017/tarefas")
                    .then(response => {
                        var alunos = response.data

                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagAlunos(alunos, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de tarefas...")
                        res.end()
                    })
            }
            // GET /alunos/:id --------------------------------------------------------------------
            else if(/\/tarefas\/[a-zA-Z0-9]+$/.test(req.url)){
                var idAluno = req.url.split("/")[2]
                axios.get("http://localhost:3017/tarefas/" + idAluno)
                    .then( response => {
                        let a = response.data
                        
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraPagAluno(a, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter o registo de aluno...")
                        res.end()
                    })
            }
            // GET /w3.css ------------------------------------------------------------------------
            else if(/w3.css$/.test(req.url)){
                fs.readFile("w3.css", function(erro, dados){
                    if(!erro){
                        res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                        res.write(dados)
                        res.end()
                    }
                })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        case "POST":
            if(req.url == '/tarefas'){
                recuperaInfo(req, resultado => {
                    console.log('POST de tarefa:' + JSON.stringify(resultado))
                    axios.post('http://localhost:3017/tarefas', resultado)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPostConfirm( resp.data, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<p>Recebi um POST não suportado.</p>')
                res.write('<p><a href="/">Voltar</a></p>')
                res.end()
            }
            break
        case 'PUT':
            console.log("oi")
            if(/\/tarefas\/[a-zA-Z0-9]+$/.test(req.url)){
                var idTarefa = req.url.split("/")[2]
                recuperaInfo(req,resultado => {
                    axios.patch('http://localhost:3017/tarefas/' + idTarefa, resultado)
                    .then(a => {
                        a.writeHead(200, {location: 'http://localhost:7777'})
                        a.end()
                    })
                    .catch(erro => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write('<p>Erro no PATCH: ' + erro + '</p>')
                        res.write('<p><a href="/">Voltar</a></p>')
                        res.end()
                    })
                })
            }
            else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<p>Recebi um POST não suportado.</p>')
                res.write('<p><a href="/">Voltar</a></p>')
                res.end()
            }
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end()
    }
})

galunoServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')