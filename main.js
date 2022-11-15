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

        this.level = {/*lägga in lista med egenskaper för varje level (5 levlar)*/}

        this.player = new Player(this, range.value)

        this.bricks = []
        this.brickCount = 8 //antal bricks(ska bero på level) | en rad är 8 st

        this.brickX = 20

        this.posCalc = 20
        this.rowAmount = 1
        this.rowCheck = 0

        this.ballInterval = 300
        this.ballTimer = 300
        this.ballCount = 1 // antal bollar (ska bero på powerup)
        this.balls = [] 
    }
    update(){
        // bollar
        this.player.update()

        if(this.ballTimer > this.ballInterval && this.balls.length < this.ballCount){

            this.balls.push(new Ball(this.player, this))
            this.ballTimer = 0

        }else{
            this.ballTimer++
            
        }
          
        
        this.balls.forEach(object => object.update())
      
        //block | lösa att bollarna inte hinner spawna
        if(this.rowCheck < this.rowAmount){
            
            this.bricks.push(new Brick(this.balls, this, this.rowAmount, this.brickX))

            if(this.rowAmount < 10){
                this.rowAmount++
            }
        }

        this.bricks.forEach(object => object.update())

        this.bricks = this.bricks.filter(object => !object.markedForDelete)
    }
    draw(){
        //ritar ut allt
        this.player.draw(this.ctx)

        this.balls.forEach(object => object.draw(this.ctx))

        this.bricks.forEach(object => object.draw(this.ctx))
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


//skapa en vektorer | byt till rect och ändra kollision 
class Ball{
    constructor(player, game){
        this.game = game
        this.player = player

        this.size = 5
        this.x = this.player.x + this.player.width/ 2
        this.y = this.player.y - this.size/ 2
        
        this.xVel = 3
        this.yVel = -3
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
        if(this.y + this.size / 2 > this.player.y && this.y && this.y < this.player.y + this.player.height && this.x > this.player.x && this.x < this.player.x + this.player.width){
            //studs ändra så att vinkeln blir anorlunda beroende på vart på rectangeln man träffar
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

class Brick{
    constructor(ball, game, row, x){
        this.game = game
        this.ball = ball
        this.pos = this.game.posCalc  //tar en input från class Game 

        this.row = row  // gör om inputen till en output i listan
        this.rows = [   0,
                        20,
                        50,
                        80,
                        110,
                        140,
                        170,
                        200,
                        230,
                        260,
                        290,
                        310
                    ]

        this.width = 100
        this.height = 20
        this.x = x
        this.y = 20
       

        this.markedForDelete = false
    }
    update(){
        
        this.y = this.rows[this.row]

        //console.log('row = ', this.row);

        if( this.x + this.width > this.ball.map(e => e.x)[0] &&
            this.x < this.ball.map(e => e.x)[0] &&
            this.y < this.ball.map(e => e.y)[0] &&
            this.y + this.height > this.ball.map(e => e.y)[0]){

            this.markedForDelete = true
            this.game.brickCount--
        }
        else{
            this.markedForDelete = false
        }
    }
    draw(ctx){
        console.log('x', this.x);
        console.log('y', this.y);
        ctx.fillRect(this.x, this.y, this.width ,this.height)
    }
}

class LevelOneBrick extends Brick{
    constructor(ball){
        super(ball)
        this.damage = 1
    }
    update(){
        super.update()
    }
    draw(ctx){
        super.draw(ctx)
    }
}

//olika typer av block
class LevelTwoBrick extends Brick{
    constructor(ball, game, pos){
        super(ball, game, pos)
        this.damage = 2
    }
    update(){
        super.update()
    }
    draw(ctx){
        super.draw(ctx)
    }
}

class LevelThreeBrick extends Brick{
    constructor(ball, game, pos){
        super(ball, game, pos)
        this.damage = 3
    }
    update(){
        super.update()
    }
    draw(ctx){
        super.draw(ctx)
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
