import express from 'express'
import http from 'http'
//import createGame from './public/game.js'
import socketio from 'socket.io'
import Aluno from './src/aluno.js'
import { isMainThread } from 'worker_threads'
import mongoose from 'mongoose'
import { rejects } from 'assert'
import { resolve } from 'dns'

mongoose.connect('mongodb://localhost/aluno_teste')
mongoose.connection
    .once('open', () => console.log('conexao com Mongo(banco de dados) foi estabelecida'))
    .on('error', (error) => {
        console.warn('Warning', error)
    })

const app = express()
const appadm = express()
const server = http.createServer(app)
const serveradm = http.createServer(appadm)
const sockets = socketio(server)
const socketsadm = socketio(serveradm)

app.use(express.static('public'))
appadm.use(express.static('publicadm'))

//const game = createGame()
//game.start()

//game.subscribe((command) => { //um Observer simples q so recebe um comando e reenvia para todos os sockets conectados com o server
//    console.log(`> Emitting ${command.type}`)
//    sockets.emit(command.type, command) // ex de command.type -> 'add-player' q seria escutado no frontEn (index.html) em: socket.on('add-player', {command} => {game.addPlayer(command)}) (Por exemplo!! ps: comparar com o codigo parafraseado anteriormente em index.html)
//})

sockets.on('connection', (socket) => { //conversa do server com os clients(n ADM)
    const playerId = socket.id // a autenticacao deve ocorrer AQUI. Utilizando-se do socket.id para rastrear momentaneamente qual jogador esta conetado nesse socket especifico, logo conversar direto com o banco de dados e dar autoricao para manter a conexcap
    console.log(`> Player connected: ${playerId}`)

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${playerId}`)
    })
    socket.on('login-client', (creden) => {
        Aluno.findOne({sockid: socket.id})
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
                                            socket.emit('login-aprovado', creden[0]) })
                            }})}
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
    const playerId = socket.id // a autenticacao deve ocorrer AQUI. Utilizando-se do socket.id para rastrear momentaneamente qual jogador esta conetado nesse socket especifico, logo conversar direto com o banco de dados e dar autoricao para manter a conexcap
    console.log(`> Player connected: ${playerId}`)


    socket.on('disconnect', () => {
        if(admid == socket.id){
            admid = "31415926"
        }
        // colocar um if aqui q checa tds os socket.id(s) q desconetarem e se for o socket do ADM tirar as permissoes de ADM relacionadas nesse socket
        console.log(`> Player disconnected: ${playerId}`)
    })
    socket.on('login-adm', (creden) => { 
        if(creden[0] == "elefantiase" && creden[1] == "GVcodeRULES"){
            admid = socket.id // esse auten = 1 talvez seja valido para tds que se conectarem a porta 5000, logo necessita-se conveesa com o banco de dados para esse verificacao
        }
        else if(socket.id == admid){
            socket.emit('alerta', 'voce ja esta logado')
        }
        else{
            socket.emit('login-negado', socket.id)
        }
        
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


        let pedro = new Aluno({ sockid: '123456', cooperativa: '3irmas', senha: '666', 147:[945,1],
        159:[0,0],
        149:[0,0],
        148:[0,0],
        158:[0,0],
        157:[0,0],
        257:[0,0],
        258:[0,0],
        259:[0,0],
        267:[0,0],
        268:[0,0],
        269:[0,0],
        347:[0,0],
        348:[0,0],
        349:[0,0],
        357:[0,0],
        358:[0,0],
        359:[0,0],
        367:[0,0],
        368:[0,0],
        369:[0,0]});
        //pedro.save()
        //    .then(Aluno.find({ nome: 'Pedro'}))
         //   .then((users) => {console.log(users)})
            //.catch(() => {console.log('erros')})
        //mongoose.connection.collections.alunos.drop()
        //pedro.save()
        //    .then(Aluno.find({ nome: 'Pedo'}))
            //.then((pessoa) => {console.log(pessoa)})
         //   .catch(() => {console.log('eerro')})
            
          //  pedro.save(() => {
          //      Aluno.findOne({ nome: 'Pedro'})
          //          .then((array) => {console.log(array)})
          //          
          //  })
            //Aluno.updateOne({ nome: 'Pedro'}, { 257: [0,1]})
    

            //
    
