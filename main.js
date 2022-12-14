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

const endScreen = document.getElementById('end-screen')
const endText = document.getElementById('end')
const timeEl = document.getElementById('time')
const continueBtn = document.getElementById('continue')


//en klass som sköter updatering och ritning av spelets object och även har koll på storlek och positioner
let isPaused = true
let turnBall = false
const bounceDiff = 180
let lastTime = 0

let playTime = 0
let timeCheck = false

// skapa en timer och highscore på levlarna

class Game{
    constructor(ctx, width, height){
        this.ctx = ctx
        this.width = width
        this.height = height
        this.range = range

        this.firstRun = true

        this.levelCheckStop = false
        this.levels = { one: {bricksOnScreen: 32, orangeRows: 1, redRows: 1}, two: {bricksOnScreen: 56, orangeRows: 3, redRows: 2}, three: {bricksOnScreen: 72, orangeRows: 4, redRows: 3}   /*lägga in lista med egenskaper för varje level (3 levlar)*/}

        this.player = new Player(this, range.value)

        this.bricks = []

        this.bricksOnScreen
        this.redRows
        this.orangeRows

        this.ballInterval = 1000
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
                this.redRows = this.levels.one.redRows
                this.orangeRows = this.levels.one.orangeRows
            }
    
            if(levelSelect.value == 2){ 
                this.bricksOnScreen = this.levels.two.bricksOnScreen
                this.redRows = this.levels.two.redRows
                this.orangeRows = this.levels.two.orangeRows
            }
    
            if(levelSelect.value == 3){ 
                this.bricksOnScreen = this.levels.three.bricksOnScreen
                this.redRows = this.levels.three.redRows
                this.orangeRows = this.levels.three.orangeRows
            }
            this.levelCheckStop = true
        }

        this.ballInterval = 1000
        this.ballTimer = 0
        this.ballCount = 1 
        this.balls = [] 


        this.iX = 0
        this.iY = 0

        playTime = 0
    }
    update(deltatime){

        //level check
       
        if(!this.levelCheckStop){
            //kod att kör en gång
            if(levelSelect.value == 1){ 
                this.bricksOnScreen = this.levels.one.bricksOnScreen
                this.redRows = this.levels.one.redRows
                this.orangeRows = this.levels.one.orangeRows
            }
    
            if(levelSelect.value == 2){ 
                this.bricksOnScreen = this.levels.two.bricksOnScreen
                this.redRows = this.levels.two.redRows
                this.orangeRows = this.levels.two.orangeRows
            }
    
            if(levelSelect.value == 3){ 
                this.bricksOnScreen = this.levels.three.bricksOnScreen
                this.redRows = this.levels.three.redRows
                this.orangeRows = this.levels.three.orangeRows

            }
            this.levelCheckStop = true
            //this.firstRun = false
        }
    

        this.player.update(deltatime)
        // bollar
        if(this.ballTimer > this.ballInterval && this.balls.length < this.ballCount){

            this.balls.push(new Ball(this.player, this))
            this.ballTimer = 0

        }else{
            this.ballTimer += deltatime 
        }
          
        
        this.balls.forEach(object => object.update(deltatime))

        //block | lösa att bollarna inte hinner spawna
        if(this.bricks.length < this.bricksOnScreen){

        if(this.bricks.length < 8*this.redRows){
            if(this.iX < 8){
            this.bricks.push(new LevelThreeBrick(this.balls, this, this.iX, this.iY)) 
            this.iX++
            }else{
                this.iY++
                this.iX = 0
            }
        } 
        
        if(this.bricks.length >= 8*this.redRows && this.bricks.length < (8*this.redRows + 8*this.orangeRows)){
            if(this.iX < 8){
            this.bricks.push(new LevelTwoBrick(this.balls, this, this.iX, this.iY)) 
            this.iX++
            }else{
                this.iY++
                this.iX = 0
            }
        }

        if(this.bricks.length >= (8*this.redRows + 8*this.orangeRows)){
            if(this.iX < 8){
            this.bricks.push(new Brick(this.balls, this, this.iX, this.iY)) 
            this.iX++
            }else{
                this.iY++
                this.iX = 0
            }

        }

    }
    
        this.bricks.forEach(object => object.update(deltatime))

        this.bricks = this.bricks.filter(object => !object.markedForDelete)

        if(this.bricksOnScreen == 0){
             range.value = 500
             isPaused = true
            endScreen.style.visibility = 'visible'
            endText.textContent = 'You won'
            timeEl.innerHTML = `Yor time was: <br> ${Math.round((lastTime / 1000) *10 ) / 10} s`
            localStorage.setItem('highScore', Math.round((lastTime / 1000) *10 ) / 10)
        }
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
    update(deltatime){
        this.x = range.value - this.width / 2
        range.max = `${this.game.width - this.width / 2}`
        range.min = `${this.width / 2}`
    }
    draw(ctx){
        ctx.fillStyle = 'black'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}


class Ball{
    constructor(player, game){
        this.game = game
        this.player = player
        this.sfx = new Audio()
        this.sfx.src="ping_pong_8bit_plop.ogg"

        this.size = 10
        this.x = this.player.x + this.player.width/ 2
        this.y = this.player.y - this.size/ 2
        
        this.deltaSpeed = 0
        this.xVel = 3
        this.yVel = -3

        this.health = 2
    }
    update(deltatime){

        if(turnBall){
            this.yVel = -this.yVel
            turnBall = false
        }

        if(this.x < 0){
            this.xVel = -this.xVel
            this.sfx.play()
        }

        if(this.x > this.game.width - this.size){
            this.xVel = -this.xVel
            this.sfx.play()
        }

        if(this.y < 0){
            this.yVel = -this.yVel
            this.sfx.play()
        }

        //Förlora liv 
        if(this.y > this.game.height + this.size){
            this.y = this.player.y - this.size/ 2
            this.x = this.player.x + this.player.width/ 2
            this.yVel = -this.yVel

            this.health--
        }

        if(this.health == 0){
            range.value = 500
            isPaused = true
            endScreen.style.visibility = 'visible'
            endText.textContent = 'You lost'
            timeEl.innerHTML = `Yor time alive was: <br> ${Math.round(lastTime / 100) / 10} s`
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
        if(this.y + this.size / 2 > this.player.y && this.y + this.size / 2 < this.player.y + this.player.height){

           if(this.x + this.size > this.player.x && this.x + this.size < this.player.x + this.player.width){
                
                this.yVel = -this.yVel 
                this.sfx.play()
           }
           
            //studs ändra så att vinkeln blir anorlunda beroende på vart på rectangeln man träffar
            if(this.x + this.size > this.player.x + this.player.width / 2 && this.x + this.size /2 < this.player.x + this.player.width){
                this.xVel = vector(40 + (this.player.x + this.player.width) - this.x)
            }

            if(this.x + this.size > this.player.x && this.x + this.size < this.player.x + this.player.width / 2 ){
                this.xVel = -vector(40 + (this.x - this.player.x))
            }
        }

        this.x += this.xVel
        this.y += this.yVel
    }
    draw(ctx){
        ctx.fillStyle = 'black'
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }
}

class Brick{
    constructor(ball, game, xV, yV){
        this.game = game
        this.ball = ball
         
        this.yV = yV
        this.xV = xV  
        this.width = 119.375
        this.height = 20

        this.rows = [   
            5,
            30,
            55,
            80,
            105,
            130,
            155,
            180,
            205,
            230,
            355
        ]
        
        this.collumns = [  
            5,
            this.width*1 + 10,
            this.width*2 + 15,
            this.width*3 + 20,
            this.width*4 + 25,
            this.width*5 + 30,
            this.width*6 + 35,
            this.width*7 + 40
        ]

        
        this.x = this.collumns[xV]
        this.y = this.rows[yV]

        this.damage = 1
        this.hits = 0

        this.color = 'chartreuse'

        this.sfx = new Audio()
        this.sfx.src="ping_pong_8bit_beeep.ogg"

        this.diffCount = 0

        this.markedForDelete = false
    }
    update(deltatime){

        this.diffCount += deltatime

        if(this.diffCount > bounceDiff){
        if(this.ball.map(e => e.y)[0] + 10 > this.y && this.ball.map(e => e.y)[0] < this.y + this.height){
            
            if(this.ball.map(e => e.x)[0] < this.x + this.width && this.ball.map(e => e.x)[0] + 10 > this.x){
                
                turnBall = true
                this.hits++

                this.sfx.play()
            }else{
                this.markedForDelete = false
            }
        }
    }

        if(this.hits == this.damage){
            this.markedForDelete = true
            this.game.bricksOnScreen--
        }
        
    }
    draw(ctx){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width ,this.height)

        ctx.fillStyle = 'black'
        ctx.font = '1000 20px serif';
        ctx.fillText(`${this.damage - this.hits}`, this.x + this.width / 2 - 10, this.y + 15)
    }
}

//olika typer av block
class LevelTwoBrick extends Brick{
    constructor(ball, game, xV, yV){
        super(ball, game, xV, yV)
        this.damage = 2
        this.color = 'orange'
    }
    update(deltatime){
        super.update(deltatime)

        if(this.damage - this.hits == 1){
            this.color = 'chartreuse'
        }
    }
    draw(ctx){
        super.draw(ctx)
    }
}

class LevelThreeBrick extends Brick{
    constructor(ball, game, xV, yV){
        super(ball, game, xV, yV)
        this.damage = 3
        this.color = 'maroon'
    }
    update(deltatime){
        super.update(deltatime)

        if(this.damage - this.hits == 2){
            this.color = 'orange'
        }

        if(this.damage - this.hits == 1){
            this.color = 'chartreuse'
        }
    }
    draw(ctx){
        super.draw(ctx)
    }
}
//Skapar ett object från min klass "Game"
const game = new Game(ctx, canvas.width, canvas.height)

//animations function
function main(timestamp){
    if(!isPaused){

        let deltatime = timestamp - lastTime
        lastTime = timestamp

        if(!this.timeCheck){
            //kod att kör en gång
            if(!timeCheck){ 
                playTime = 0
                timeCheck = true
            }
        }
        
        playTime += deltatime

        console.log();
    
        //tar bort tidigare scen
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //ritar ut spelet
        game.update(deltatime)
        game.draw()
    }
    requestAnimationFrame(main)
}

main(0)

startBtn.addEventListener('click', function(){
    menu.style.visibility='hidden'
    isPaused = false
    game.reset()
    range.value = 500
    
})

continueBtn.addEventListener('click', function(){
    endScreen.style.visibility='hidden'
    menu.style.visibility='visible'
})

//funktion som skapar en vektor av x oxh y
function vector(angle){
    let newAngle = angle/(180/Math.PI)
    let xVel = 3/(Math.tan(newAngle))

    return xVel
}