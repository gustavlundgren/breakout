//canavs setup
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 1000
canvas.height = 800

//försöka få inte global kanske
const range = document.getElementById('range')

//en klass som sköter updatering och ritning av spelets object och även har koll på storlek och positioner
class Game{
    constructor(ctx, width, height){
        this.ctx = ctx
        this.width = width
        this.height = height
        this.range = range

        this.player = new Player(this, range.value)
    }
    update(){
        this.player.update()
    }
    draw(){
        this.player.draw(this.ctx)
    }
}

class Player{
    constructor(game){
        this.game = game
        this.x = range.value
        this.y = this.game.height - 100
        this.width = 80
        this.height = 20
    }
    update(){
        this.x = range.value - this.width / 2
        range.max = `${this.game.width - this.width / 2}`
        range.min = `${this.width / 2}`
    }
    draw(ctx){
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Ball{
    constructor(){

    }
    update(){

    }
    draw(){

    }
}

//Skapar ett object från min klass "Game"
const game = new Game(ctx, canvas.width, canvas.height)

//animations function
function main(){
    //tar bort tidigare scen
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //ritar ut spelet
    game.update()
    game.draw()

    //ctx.fillRect(20, 20, 100, 100)
    requestAnimationFrame(main)
}

main()