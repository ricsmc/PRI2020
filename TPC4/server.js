var http = require('http')
var fs = require('fs');

var servidor = http.createServer(function(req,res){
    if(req.url.match(/\/arqs\/([1-9]|[1-9][0-9]|[1-9][0-2][0-9]|\*)$/)){
        var arqs = req.url.split("/")[1]
        var num = req.url.split("/")[2]
        console.log(num);
        if(arqs==='arqs' && num){
            if (num==='*'){
                fs.readFile('arqweb/index.html', function(err, data){
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
               
                    fs.readFile('arqweb/arq' + num + '.html', function(err, data){
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
        }
        else if(arqs==='arqs'){
            res.writeHead(200, {location: 'http://localhost:7777/arqs/*'});
            res.end();
        }

        
        
    }
    else if(req.url.match(/$/) | req.url.match(/arqs$/)){
        res.writeHead(200, {location: 'http://localhost:7777/arqs/*'});
        res.end();
    }
    else{
                console.log("ERRO: foi pedido um ficheiro inesperado!")
                res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'})
                res.write("<p>Ficheiro inexistente.</p>")
                res.end()
    }
    
  
       
       
});

servidor.listen(7777);

console.log('Servidor aberto na porta 7777..')