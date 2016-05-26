import config from 'config'
import PIXI from 'pixi.js'

export default class Jello {

    constructor(options = {}) {

        this.defaults = {}
        this.options = options
        this.container = options.container

        this.imgWidth = options.images[0].width
        this.imgHeight = options.images[0].height
        this.imgRatio = this.imgHeight / this.imgWidth
        this.winWidth = config.width
        
        this.bgArray = options.images
        this.bgSpriteArray = []

        this.renderer = PIXI.autoDetectRenderer(this.winWidth, (this.winWidth * this.imgRatio))
        this.stage = new PIXI.Container()
        this.imgContainer = new PIXI.Container()

        this.displacementSprite = PIXI.Sprite.fromImage(`${APP.THEME_URL}/assets/images/wood.jpg`)
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
        
        this.currentMap = {}
        this.counter = { image: 0, map: 0 }
        this.mapArray = [
            { image: `${APP.THEME_URL}/assets/images/displacement-3.jpg`, speed: 1.5, scale: 250 },
            { image: `${APP.THEME_URL}/assets/images/displacement-4.jpg`, speed: 1.5, scale: 250 }
        ]

        this.rAF = undefined
        this.requestAnimationFrame = this.requestAnimationFrame.bind(this)

        this.isDistorted = true
        this.isTransitioning = false
    }

    init() {
        
        this.defaults = {
            transition: 1,
            speed: 1,
            dispScale: 15,
            dispX: true,
            dispY: true,
            count: 0
        }

        this.update()
        // this.backgroundFill()
        this.buildStage()
        this.createBackgrounds()
        // this.createMask()
        this.createFilters()

        // this.imgContainer.mask = this.mask
        
        this.requestAnimationFrame()

        this.renderer.view.setAttribute('class', 'jello-canvas')
        this.container.appendChild(this.renderer.view)
    }

    requestAnimationFrame() {
        
        this.displacementFilter.scale.x = this.settings.dispX ? this.settings.transition * this.settings.dispScale : 0
        this.displacementFilter.scale.y = this.settings.dispY ? this.settings.transition * (this.settings.dispScale + 10) : 0

        this.displacementSprite.x = Math.sin(this.settings.count * 0.15) * 200
        this.displacementSprite.y = Math.cos(this.settings.count * 0.13) * 200

        this.displacementSprite.rotation = this.settings.count * 0.06

        this.settings.count += 0.05 * this.settings.speed

        this.renderer.render(this.stage)
        
        this.rAF = requestAnimationFrame(this.requestAnimationFrame)
    }

    backgroundFill() {

        this.renderer.view.setAttribute('style', 'height:auto;width:100%;');
    }
    
    buildStage() {

        this.imgContainer.position.x = this.imgWidth / 2
        this.imgContainer.position.y = this.imgHeight / 2

        this.stage.scale.x = this.stage.scale.y = this.winWidth / this.imgWidth;
        this.stage.interactive = true
        this.stage.addChild(this.imgContainer)
    }

    changeImage() {
        
        if(this.counter.image < (this.bgArray.length - 1)) {
            this.counter.image++
        } else {
            this.counter.image = 0
        }
        
        this.bgSpriteArray.map((sprite, i) => TweenLite.to(sprite, 1, { alpha: i == this.counter.image ? 1 : 0, ease: Expo.easeOut }))
    }

    changeMap() {

        if(this.counter.map < (this.mapArray.length - 1)) {
            this.counter.map++
        } else {
            this.counter.map = 0
        }

        this.currentMap = this.mapArray[this.counter.map]
        this.displacementSprite = PIXI.Sprite.fromImage(`${this.currentMap.image}`)
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
        
        this.createFilters()
    }

    toggleDistortion() {
        
        if(this.isDistorted) {

            this.distortionLevel(0)
            this.isDistorted = false
        } else {

            this.distortionLevel(1)
            this.isDistorted = true
        }
    }

    createBackgrounds() {

        this.bgArray.map((el) => {

            const bg = PIXI.Sprite.fromImage(el.image)

            bg.texture.baseTexture.on('loaded', () => {

                // Set image anchor to the center of the image
                bg.anchor.x = 0.5
                bg.anchor.y = 0.5

                this.imgContainer.addChild(bg)
                this.bgSpriteArray.push(bg)
                
                // set first image alpha to 1, all else to 0
                bg.alpha = this.bgSpriteArray.length === 1 ? 1 : 0
            })
        })
    }

    createMask() {

        // const mask = this.mask = PIXI.Sprite.fromImage(`${APP.THEME_URL}/assets/images/svg/logo.svg`)
        // this.imgContainer.addChild(mask)
        
        var svg = document.querySelector('#logo')
        var SVGGraphics = require('pixi-svg-graphics')
        var mask = this.mask = new PIXI.Graphics()

        mask.width = config.width
        // mask.height = config.height

        // console.log(mask.width, mask.height)
        // mask.anchor.x = 0.5
        // mask.anchor.y = 0.5

        mask.beginFill(0xFFFFFF)
        SVGGraphics.drawSVG(mask, svg)

        mask.endFill();
        
        this.imgContainer.addChild(mask)
    }

    createFilters() {
        
        this.stage.addChild(this.displacementSprite)

        this.displacementFilter.scale.x = this.displacementFilter.scale.y = this.winWidth / this.imgWidth

        this.imgContainer.filters = [this.displacementFilter]
    }

    distortionLevel(amt) {

        if(!this.isTransitioning){

            this.isTransitioning = true

            TweenLite.to(this.settings, 1, {
                transition: amt,
                speed: this.currentMap.speed,
                dispScale: this.currentMap.scale,
                ease: Power2.easeInOut,
                onComplete: () => {
                    this.isTransitioning = false;
                }
            });
        }
    }

    update() {

        this.settings = Object.assign({}, this.defaults, this.options);
    }

    resize() {}

    destroy() {
        
        cancelAnimationFrame(this.rAF)
        this.settings = {}
        this.bgArray = []
        this.bgSpriteArray = []
    }
}