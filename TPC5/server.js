const axios = require ('axios');
var http = require('http')
var fs = require('fs');


var servidor = http.createServer(function(req,res){
    if(req.url.match(/\/(alunos|instrumentos|cursos)\/[0-9]+$/)){
        var tipo = req.url.split("/")[1]
        var pag = req.url.split("/")[2]
        axios.get('http://localhost:3000/' + tipo + '?_page=' + pag)
            .then(resp => {
            data=resp.data;
            
            res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})
            if(tipo === 'alunos'){
                res.write("<h1>Alunos</h1>")
                res.write("<ul>")
                data.forEach(a => {
                    res.write(`<li><a href=\"http://localhost:3000/alunos/${a.id}\">${a.id}, ${a.nome} , ${a.instrumento}</li>`)
                });
            }
            if(tipo === 'instrumentos'){
                res.write("<h1>Instrumentos</h1>")
                res.write("<ul>")
                data.forEach(a => {
                    res.write(`<li><a href=\"http://localhost:3000/instrumentos/${a.id}\">${a.id}, ${a['#text']}</li>`)
                });
            }
            if(tipo === 'cursos'){
                res.write("<h1>Cursos</h1>")
                res.write("<ul>")
                data.forEach(a => {
                    res.write(`<li><a href=\"http://localhost:3000/cursos/${a.id}\">${a.id}, ${a.designacao}</li>`)
                });
            }
            res.write("</ul>")
            var last = resp.headers.link.split(",")[2].split(";")[0].split('?')[1].split('=')[1].split('>')[0]
            var first = resp.headers.link.split(",")[0].split(";")[0].split('?')[1].split('=')[1].split('>')[0]
            nx = parseInt(pag)+1
            px = parseInt(pag) -1
            if(pag != last) res.write('<p><a href="http://localhost:3001/' + tipo + '/' + nx + '">Next Page</a></p>')
            if(pag != first) res.write('<p><a href="http://localhost:3001/' + tipo + '/' + px + '">Previous Page</a></p>')
            
            res.end()
        })
        .catch(error => {
            console.log('ERRO: ' + error);
        });
    }
    else if(req.url.match(/$/)){
        fs.readFile('index.html', function(err, data){
            if(err){
                console.log('ERRO na leitura do ficheiro: ' + err)
                res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})
                res.write("<p>Ficheiro inexistente.</p>")
                res.end()
            }
            else{
             res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})
             res.write(data)
             res.end()
            }
        })
    }
    else{
                console.log("ERRO: foi pedido um ficheiro inesperado!")
                res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})
                res.write("<p>Ficheiro inexistente.</p>")
                res.end()
    }
    
  
       
       
});

servidor.listen(3001);

console.log('Servidor aberto na porta 3001..')
