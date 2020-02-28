require = require("esm")(module /*, options*/);
const express = require('express');
const app = express();
const http = require('http')
//import createGame from './public/game.js'
const  socketio = require('socket.io')
const Aluno = require('./src/aluno.js')
const { isMainThread } =require('worker_threads')
const mongoose =require('mongoose')
const { rejects } =require('assert')
const { resolve } =require('dns')

mongoose.connect('mongodb://localhost/')
mongoose.connection
    .once('open', () => console.log('conexao com Mongo(banco de dados) foi estabelecida'))
    .on('error', (error) => {
        console.warn('Warning', error)
    })
//mongoose.set('useFindAndModify', false);


const appadm = express()
const server = http.createServer(app)
const serveradm = http.createServer(appadm)
const sockets = socketio(server)
const socketsadm = socketio(serveradm)

let pesquisas = []

app.use(express.static('public'))
appadm.use(express.static('publicadm'))

sockets.on('connection', (socket) => { //conversa do server com os clients(n ADM)
    console.log(`> Player connected: ${socket.id}`)

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${socket.id}`)
    })
    socket.on('login-client', (creden) => {
        Aluno.findOne({sockid: socket.id}) // se n achar retorna Null e se vc tentar fazer essa pesquisa com um String sendo q no Schema ta como Number vai ir pro Catch ou vai pro Catch tb se n conseguir se conectar com o MongoDB
            .then((ll) => {
                if(ll !== null){socket.emit('ja-conectado', socket.id)}
                else{
                    Aluno.findOne({ cooperativa: creden[0], senha: creden[1]})
                        .then((user) => { if(user == null){
                                socket.emit('login-negado', creden[0])
                                }
                                else{
                                    Aluno.findOneAndUpdate({ _id: user._id}, { sockid: socket.id })
                                        .then((zz) => { 
                                            socket.emit('login-aprovado', creden[0]) 
                                            socket.emit('dados-servicos', [user["147"],
                user["148"],
                user["149"],
                user["157"],
                user["158"],
                user["159"],
                user["257"],
                user["258"],
                user["259"],
                user["267"],
                user["268"],
                user["269"],
                user["347"],
                user["348"],
                user["349"],
                user["357"],
                user["358"],
                user["359"],
                user["367"],
                user["368"],
                user["369"],
                user["taokeys"],
                user["frota"],
                user["promotores"],
                user["comissao"],
                user["distribuidores"],
                user["pas"]])
                                        })
                                        .catch(() => console.log('falha ao registrar login do player com socket: ' + socket.id))
                            }})
                        .catch(() => {console.log('falha na comunicacao com o Banco de dados n 403 ' + socket.id)})
                        }
            })
            .catch(() => {console.log('falha na comunicacao com o Banco de dados n 504 ' +socket.id)})

                       
    })
    socket.on('pesquisar-pas', () => {
        Aluno.findOne({sockid: socket.id})
            .then((userx) => { 
                    if(userx !== null){
                        //console.log(user.taokeys + ' ccccccccccccccc');
                        if(userx['taokeys'] >= 2160){
                           //console.log(user.taokeys + " <====")
                           userx.taokeys = userx.taokeys - 2160
                           //console.log(user.taokeys)
                           userx.save()
                            .then(() => {Aluno.findOne({ _id: userx._id})
                                            .then((user) => {if(user.taokeys == userx.taokeys){
                                                console.log(user.taokeys + ' <----')
                                                console.log(user + ' <=====')
                                                socket.emit('update', [user["147"],
                user["148"],
                user["149"],
                user["157"],
                user["158"],
                user["159"],
                user["257"],
                user["258"],
                user["259"],
                user["267"],
                user["268"],
                user["269"],
                user["347"],
                user["348"],
                user["349"],
                user["357"],
                user["358"],
                user["359"],
                user["367"],
                user["368"],
                user["369"],
                user["taokeys"],
                user["frota"],
                user["promotores"],
                user["comissao"],
                user["distribuidores"],
                user["pas"]]);
                socket.emit('resposta-pesquisar-pas');
                                            }                  
                                        })
                                            .catch(() => {console.log('erro na confirmacao n 302')})
                                    })
                            .catch(() => {console.log('falha em salvar salvar transacao por pesquisa n 307')})
                            }

                        else{
                            socket.emit('operacao-negada', 'falta caixa');
                            //console.log('hlu')
                    }
                    //console.log(user.taokeys)
                    }
                    else{
                        socket.emit('acesso-negado')
                    }
            }) 
            .catch(() => { console.log('falha na comunicacao com o banco de dados para o ' +socket.id)
    })
    })


    socket.on('alterar-porcetagem-comissao', () => { //continuar essa logica dentro do sockets.on('connection', ...) para outros comandos! como um comando do admin-client mudando uma variavel ou um client normal querendo mandar alguma informacao para o server
        Aluno.findOne({sockid: socket.id})
            .then((ll) => {console.log(ll['147'])}) //'se o player ja estiver conectado esse ll sera o Schema dele, pronto para ser tratado'
            .then(() => console.log('meuu'))
            .catch(() => {socket.emit('acesso-negado')}) //cai aqui se ll['147'] n conseguir ser lido, logo qnd o usuario n esta logado
        })  
})


server.listen(3000, () => {
    console.log(`--> Server escutando porta: 3000`)
})
let admid = "31415926"
socketsadm.on('connection', (socket) => { //conversa do server com o client do ADM
    let auten = 0
 // a autenticacao deve ocorrer AQUI. Utilizando-se do socket.id para rastrear momentaneamente qual jogador esta conetado nesse socket especifico, logo conversar direto com o banco de dados e dar autoricao para manter a conexcap
    console.log(`> Player connected: ${socket.id}`)


    socket.on('disconnect', () => {
        if(admid == socket.id){
            admid = "31415926"
        }
        // colocar um if aqui q checa tds os socket.id(s) q desconetarem e se for o socket do ADM tirar as permissoes de ADM relacionadas nesse socket
        console.log(`> Player disconnected: ${socket.id}`)
    })
    socket.on('login-adm', (creden) => { 
        console.log('putz')
        if(creden[0] == "elefantiase" && creden[1] == "GVcodeRULES"){
            socket.emit('login-aprovado')
            admid = socket.id // esse auten = 1 talvez seja valido para tds que se conectarem a porta 5000, logo necessita-se conveesa com o banco de dados para esse verificacao
        }
        else if(socket.id == admid){
            socket.emit('alerta', 'voce ja esta logado')
        }
        else{
            socket.emit('login-negado', socket.id)
        }
        
    })
    socket.on('inicar-turno', () => {
        Aluno.find({ativo: 1})
            .then((users) => {
                let npas = 0;
                let ndistri = 0;
                let s147,
                s159,
                s149,
                s148,
                s158,
                s157,
                s257,
                s258,
                s259,
                s267,
                s268,
                s269,
                s347,
                s348,
                s349,
                s357,
                s358,
                s359,
                s367,
                s368,
                s369
                for(let i = 0; i < users.length; i++){
        s147 = s147 + users[i]['147'][1];
        s159 = s159 + users[i]['159'][1];
        s149 = s149 + users[i]['149'][1];
        s148 = s148 + users[i]['148'][1];
        s158 = s158 + users[i]['158'][1];
        s157 = s157 + users[i]['157'][1];
        s257 = s257 + users[i]['257'][1];
        s258 = s258 + users[i]['258'][1];
        s259 = s259 + users[i]['259'][1];
        s267 = s267 + users[i]['267'][1];
        s268 = s268 + users[i]['268'][1];
        s269 = s269 + users[i]['269'][1];
        s347 = s347 + users[i]['347'][1];
        s348 = s348 + users[i]['348'][1];
        s349 = s349 + users[i]['349'][1];
        s357 = s357 + users[i]['357'][1];
        s358 = s358 + users[i]['358'][1];
        s359 = s359 + users[i]['359'][1];
        s367 = s367 + users[i]['367'][1];
        s368 = s368 + users[i]['368'][1];
        s369 = s369  + user[i]['369'][1]
       

            }
        let servicos = [s147,
            s159,
            s149,
            s148,
            s158,
            s157,
            s257,
            s258,
            s259,
            s267,
            s268,
            s269,
            s347,
            s348,
            s349,
            s357,
            s358,
            s359,
            s367,
            s368,
            s369]
            pesquisas.push(servicos)
            console.log(servicos)
        })
            .catch(()=> {console.log('falha na comunicacao com o banco de dados n 309')})
    })
    socket.on('mudar-dolar-adm', (valor) => {
        console.log("valor_de_mudar_dolar_adm: " + valor)
        if(socket.id == admid){
            console.log('dolar alterado com sucesso')
            //madar pro MONGO q o socket.id q passou por esse IF eh o ID do ADM
            //alterar o banco de DADOS
        }
        else{
            console.log('aceeso-negado ' + socket.id)
            socket.emit('acesso-negado', socket.id)
        }
        
        
    })
    socket.on('mudar-SELIC-adm', (valor) => {
        if(auten == 1){
            //alterar o banco de DADOS
        }
        else{
            socket.emit('acesso-negado', socket.id)
        }
        
    })
        })
serveradm.listen(5000, () => {
    console.log('--> Server escutando porta 5000')
})//OeoyESUTIp-NeB0bAAAE
//81, 84 e 85 contro
//INTERACAO COM O BANCO DE DAOS \/


        let jogador = new Aluno({ sockid: 123456, ativo: 1, taokeys: 18720000, comissao: 0.25, frota: 10, cooperativa: '3irmas', pas: 25, distribuidores: 500, promotores: 350, senha: '666', 
        147:[945,1, 288],
        159:[0,0, 396],
        149:[0,0, 360],
        148:[0,0,324],
        158:[0,0,360],
        157:[0,0, 324],
        257:[0,0,396],
        258:[0,0,432],
        259:[0,0,468],
        267:[0,0,432],
        268:[0,0,468],
        269:[0,0,504],
        347:[0,0,432],
        348:[0,0,468],
        349:[0,0,504],
        357:[0,0,468],
        358:[0,0,504],
        359:[0,0,540],
        367:[0,0,504],
        368:[0,0,540],
        369:[0,0,576]});
        jogador.save()
        //    .then(Aluno.find({ nome: 'Pedro'}))
         //   .then((users) => {console.log(users)})
            //.catch(() => {console.log('erros')})
        //mongoose.connection.collections.alunos.drop()
        //jogador.save()
        //    .then(Aluno.find({ nome: 'Pedo'}))
        //    .then((pessoa) => {console.log(pessoa)})
        //    .catch(() => {console.log('eerro')})
            
          //  jogador.save(() => {
          //      Aluno.findOne({ nome: 'Pedro'})
          //          .then((array) => {console.log(array)})
          //          
          //  })
            //Aluno.updateOne({ nome: 'Pedro'}, { 257: [0,1]})
          /*  Aluno.findOne({ sockid: socket.id})
                .then((user) => { if(user.taokeys > x*custo){
                    Aluno.updateOne({sockid: socket.id},{ taokeys: user.taokeys - x*custo})
                }})
                .catch(() => )
                */
            //
    
