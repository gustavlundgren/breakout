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
        this.balls = []
        this.ballInterval = 300
        this.ballTimer = 0
    }
    update(){
        this.player.update()

        if(this.ballTimer > this.ballInterval){
            this.balls.push(new Ball(this.player, this))
            this.ballTimer = 0
        }else{
            this.ballTimer++
        }

        if(this.balls.length == 2){
            this.balls.pop()
        }

        this.balls.forEach(object => object.update())
    }
    draw(){
        this.player.draw(this.ctx)
        this.balls.forEach(object => object.draw(this.ctx))
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


//skapa en vektorer
class Ball{
    constructor(player, game){
        this.game = game
        this.player = player

        this.size = 5
        this.x = this.player.x + this.player.width/ 2
        this.y = this.player.y - this.size/ 2
    
        this.xVel = 1
        this.yVel = -1
    }
    update(){

        if(this.x < this.size / 2){
            this.xVel = -this.xVel
        }

        if(this.x > (this.game.width) - (this.size / 2)){
            this.xVel = -this.xVel
        }

        if(this.y < this.size/ 2){
            this.yVel = -this.yVel
        }

        //Förlora liv 
        if(this.y > this.game.height + this.size/ 2){
            this.y = this.player.y - this.size/ 2
            this.x = this.player.x + this.player.width/ 2
            this.yVel = -this.yVel
        }

        //kolla efter kollisoin med spelaren
        if(this.y + this.size / 2 > this.player.y && this.x > this.player.x && this.x < this.player.x + this.player.width){
            this.yVel = -this.yVel
        }

        this.x += this.xVel
        this.y += this.yVel
    }
    draw(ctx){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
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

    requestAnimationFrame(main)
}

main()