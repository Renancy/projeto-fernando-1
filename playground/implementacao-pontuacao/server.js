import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.start()

game.subscribe((command) => { //um Observer simples q so recebe um comando e reenvia para todos os sockets conectados com o server
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command) // ex de command.type -> 'add-player' q seria escutado no frontEn (index.html) em: socket.on('add-player', {command} => {game.addPlayer(command)}) (Por exemplo!! ps: comparar com o codigo parafraseado anteriormente em index.html)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id // a autenticacao deve ocorrer AQUI. Utilizando-se do socket.id para rastrear momentaneamente qual jogador esta conetado nesse socket especifico, logo conversar direto com o banco de dados e dar autoricao para manter a conexcap
    console.log(`> Player connected: ${playerId}`)

    game.addPlayer({ playerId: playerId }) //alterando o state do jogo q roda no backend

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })
        console.log(`> Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'
        
        game.movePlayer(command)
    })
})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})