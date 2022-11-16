//canavs setup
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 1000
canvas.height = 800 

//försöka få inte global kanske
const range = document.getElementById('range')

const menu = document.getElementById('menu')
const startBtn = document.getElementById('start-btn')
const levelSelect = document.getElementById('level-select')

const health1 = document.getElementById('health-1')
const health2 = document.getElementById('health-2')

//en klass som sköter updatering och ritning av spelets object och även har koll på storlek och positioner
let isPaused = true
let turnBall = false

class Game{
    constructor(ctx, width, height){
        this.ctx = ctx
        this.width = width
        this.height = height
        this.range = range

        this.firstRun = true

        this.levelCheckStop = false
        this.levels = { one: {bricksOnScreen: 32, }, two: {bricksOnScreen: 56, }, three: {bricksOnScreen: 72, }   /*lägga in lista med egenskaper för varje level (3 levlar)*/}

        this.player = new Player(this, range.value)

        this.bricks = []

        this.bricksOnScreen

        this.ballInterval = 110
        this.ballTimer = 0
        this.ballCount = 1 // antal bollar (ska bero på powerup)
        this.balls = [] 


        this.iX = 0
        this.iY = 0
    }
    reset(){

        this.player = new Player(this, range.value)

        this.bricks = []

        this.levelCheckStop = false

        console.log(levelSelect.value);
        if(!this.levelCheckStop ){
            //kod att kör en gång
            if(levelSelect.value == 1){ 
                this.bricksOnScreen = this.levels.one.bricksOnScreen
            }
    
            if(levelSelect.value == 2){ 
                this.bricksOnScreen = this.levels.two.bricksOnScreen
            }
    
            if(levelSelect.value == 3){ 
                this.bricksOnScreen = this.levels.three.bricksOnScreen
            }
            this.levelCheckStop = true
        }

        this.ballInterval = 110
        this.ballTimer = 0
        this.ballCount = 1 
        this.balls = [] 


        this.iX = 0
        this.iY = 0

        
    }
    update(){

        //level check
       
        if(!this.levelCheckStop){
            //kod att kör en gång
            if(levelSelect.value == 1){ 
                this.bricksOnScreen = this.levels.one.bricksOnScreen
            }
    
            if(levelSelect.value == 2){ 
                this.bricksOnScreen = this.levels.two.bricksOnScreen
            }
    
            if(levelSelect.value == 3){ 
                this.bricksOnScreen = this.levels.three.bricksOnScreen
            }
            this.levelCheckStop = true
            //this.firstRun = false
        }
    

        this.player.update()

        // bollar
        if(this.ballTimer > this.ballInterval && this.balls.length < this.ballCount){

            this.balls.push(new Ball(this.player, this))
            this.ballTimer = 0

        }else{
            this.ballTimer++ 
        }
          
        
        this.balls.forEach(object => object.update())
      
        //block | lösa att bollarna inte hinner spawna
        if(this.bricks.length < this.bricksOnScreen){
            if(this.iX < 8){
            this.bricks.push(new Brick(this.balls, this, this.iX, this.iY)) 
            this.iX++
            }else{
                this.iY++
                this.iX = 0
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

        this.size = 10
        this.x = this.player.x + this.player.width/ 2
        this.y = this.player.y - this.size/ 2
        
        this.xVel = 3
        this.yVel = -3

        this.health = 2
    }
    update(){

        if(turnBall){
            this.yVel = -this.yVel
            turnBall = false
        }

        if(this.x < 0){
            this.xVel = -this.xVel
        }

        if(this.x > this.game.width - this.size){
            this.xVel = -this.xVel
        }

        if(this.y < 0){
            this.yVel = -this.yVel
        }

        //Förlora liv 
        if(this.y > this.game.height + this.size){
            this.y = this.player.y - this.size/ 2
            this.x = this.player.x + this.player.width/ 2
            this.yVel = -this.yVel

            this.health--
        }

        if(this.health == 0){
            isPaused = true
            alert('törsk')
            menu.style.visibility = 'visible'
            this.health = 2
        }

        switch(this.health){
            case 0:
                health1.src='heart-empty.png'
                health2.src='heart-empty.png'
                break
            case 1:
                health1.src='heart.png'
                health2.src='heart-empty.png'
                break
            case 2:
                health1.src='heart.png'
                health2.src='heart.png'
                break
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
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }
}

class Brick{
    constructor(ball, game, xV, yV){
        this.game = game
        this.ball = ball
         
        this.yV = yV
        this.xV = xV  

        this.rows = [   
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
        
        this.collumns = [  
            20,
            140,
            260,
            380,
            500,
            620,
            740,
            860,
        ]

        this.width = 100
        this.height = 20
        this.x = this.collumns[xV]
        this.y = this.rows[yV]

        this.damage = 1
        this.hits = 0

        this.markedForDelete = false
    }
    update(){

        if( this.x + this.width > this.ball.map(e => e.x)[0] - this.ball.map(e => e.size)[0] / 2 &&
            this.x < this.ball.map(e => e.x)[0] &&
            this.y < this.ball.map(e => e.y)[0] &&
            this.y + this.height > this.ball.map(e => e.y)[0] - this.ball.map(e => e.size)[0] / 2){
            
            turnBall = true
            this.hits++

            this.game.bricksOnScreen--
        }
        else{
            this.markedForDelete = false
        }

        if(this.hits == this.damage){
            this.markedForDelete = true
        }
        
    }
    draw(ctx){
        ctx.fillRect(this.x, this.y, this.width ,this.height)
    }
}

//olika typer av block
class LevelTwoBrick extends Brick{
    constructor(ball, game){
        super(ball, game)
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
    constructor(ball, game){
        super(ball, game)
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
    if(!isPaused){

    
    //tar bort tidigare scen
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //ritar ut spelet
    game.update()
    game.draw()
    }
    requestAnimationFrame(main)
}


main()


startBtn.addEventListener('click', function(){
    menu.style.visibility='hidden'
    isPaused = false
    game.reset()
})