const $= document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'MUSIC-PLAYER'

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')   
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app={
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    songs : [
        {
            name:'Gieo quẻ',
            singer:'Hoàng Thùy Linh',
            path:'./assets/music/gq-htl.mp3',
            image:'./assets/img/gq-htl.jpg'
        },
        {
            name:'Hãy Trao Cho Anh',
            singer:'Sơn Tùng M-TP',
            path:'./assets/music/htca-stmtp.mp3',
            image:'./assets/img/htca-stmtp.jpg'
        },
        {
            name:'Nơi Này Có Anh',
            singer:'Sơn Tùng M-TP',
            path:'https://data37.chiasenhac.com/downloads/1897/1/1896719-828a80eb/320/Noi%20Nay%20Co%20Anh%20-%20Son%20Tung%20M-TP.mp3',
            image:'./assets/img/nnca-stmtp.jpg'
        },
        {
            name:'Sài Gòn hôm nay mưa',
            singer:'JSOL, Hoàng Duyên',
            path:'./assets/music/sshnm-jsol,hd.mp3',
            image:'./assets/img/sshnm-jsol,hd.jpg'
        },
        {
            name:'See Tình',
            singer:'Hoàng Thùy Linh',
            path:'./assets/music/st-htl.mp3',
            image:'./assets/img/st-htl.jpg'
        },
        {
            name:'2AM',
            singer:'JustaTee feat Big Daddy',
            path:'./assets/music/2AM.mp3',
            image:'./assets/img/2AM.jpg'
        },
        {
            name:'3107 3 - W/n',
            singer:'W/n ft. Nâu, Duongg, Titie',
            path:'https://data.chiasenhac.com/down2/2185/1/2184581-d20301b6/320/3107-3%20-%20W_n_%20Nau_%20Duongg_%20Titie.mp3',
            image:'./assets/img/3107-3.jpg'
        },
        {
            name:'3107 2 - W/n',
            singer:'W/n ft. Nâu, Duongg',
            path:'./assets/music/31072.mp3',
            image:'./assets/img/31072.jpg'
        },
        {
            name:'Thằng Điên',
            singer:'JustaTee x Phương Ly',
            path:'./assets/music/thangdien.mp3',
            image:'./assets/img/thangdien.jpg'
        },
    ],
    render:function(){
        const htmls = this.songs.map( (song,index) => {
            return `<div data-index="${index}" class="song ${index === this.currentIndex? 'active' : ''}">
            <div class="thumb" style="background-image: url('${song.image}')"></div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        }).join('')
        $('.playlist').innerHTML = htmls
    },
    defineProperties : function(){
        Object.defineProperty(this, 'currentSong', {
            get : function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents:function(){
        // xu li phong to thu nho cd
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            cd.style.width = (cdWidth - window.scrollY) > 0 ? cdWidth - window.scrollY +'px' : 0 + 'px'
            cd.style.opacity = (1 - (window.scrollY/cdWidth) + 0.2)*100 + '%'
        }
        // handle click play
        playBtn.onclick= () => {
            if(this.isPlaying){
                audio.pause()
            }
            else{
                audio.play();
            }
        }
        // handle Cd rotation change
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // when song is playing
        audio.onplay = ()=>{
            this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // when song is pausing
        audio.onpause = ()=>{
            this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //when change the progress.value
        audio.ontimeupdate = function(){
            progress.value =(audio.currentTime/audio.duration) ?
             Math.floor(audio.currentTime/audio.duration * 100) 
             : 0

            $('.time-left').innerText = SectoMin(Math.floor(audio.currentTime))
            $('.time-right').innerText = SectoMin(Math.floor(audio.duration))
        }
        progress.onchange =(e)=>{
            audio.currentTime = e.target.value/100*audio.duration
        }
        //next and prev song
        nextBtn.onclick = ()=>{
            this.isRandom ? this.playRandomSong():this.nextSong()
            // this.nextSong()
            audio.play()
        }
        prevBtn.onclick = ()=>{
            this.isRandom ? this.playRandomSong():this.prevSong()
            audio.play()
        }
        //turn on/off random button
        randomBtn.onclick = (e)=>{
            this.isRandom = !this.isRandom
            this.setConfig('isRandom', this.isRandom)
            randomBtn.classList.toggle('active', this.isRandom)
        }
        // when end a song
        audio.onended =()=>{
            if(this.isRandom)
                this.playRandomSong()
            else if(!this.isRepeat){
                this.nextSong()
            }   
            audio.play()
        }
        // turn on/off repeat button
        repeatBtn.onclick = ()=>{
            this.isRepeat = !this.isRepeat
            this.setConfig('isRepeat', this.isRepeat)
            repeatBtn.classList.toggle('active', this.isRepeat)
        }
        // listen to click on playlist
        playlist.onclick=(e)=>{
            const songnode = e.target.closest('.song:not(.active)')
            if(songnode || e.target.closest('.option'))
            {
                // handle click on song
                if(songnode){
                    this.currentIndex = songnode.dataset.index*1
                    this.loadCurrentSong()
                    audio.play()
                }
            }
        }
    },
    scrollToActiveSong(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block: 'center',
            })
        }, 250);
    },
    loadCurrentSong(){
        heading.textContent= this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

        this.setConfig('currentIndex', this.currentIndex)

        const songActive = $('.song.active')
        if(songActive){
            if(songActive.dataset.index*1 !== this.currentIndex){
                songActive.classList.remove('active')
                $(`[data-index="${this.currentIndex}"]`).classList.toggle('active')
            }
        }
    },
    loadConfig(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        this.currentIndex = this.config.currentIndex ? this.config.currentIndex : 0

        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },
    nextSong(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length)
            this.currentIndex = 0
        this.loadCurrentSong()
        this.scrollToActiveSong()
    },
    prevSong(){
        this.currentIndex--;
        if(this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1
        this.loadCurrentSong()
        this.scrollToActiveSong()
    },
    playRandomSong(){
        let randomIndex
        do{
            randomIndex=Math.floor(Math.random()*this.songs.length)
        }
        while(randomIndex === this.currentIndex)
        this.currentIndex=randomIndex
        this.loadCurrentSong()
    },
    start : function(){
        // load config
        this.loadConfig();
        // define Properties
        this.defineProperties();
        //load Current Song
        this.loadCurrentSong()
        // handle Events
        this.handleEvents();
        // render UI
        this.render();
    }
}

app.start()

function SectoMin(sec){
    if(Number.isNaN(sec)) return '00:00'
    var min = Math.floor(sec/60);
    sec = sec - min * 60;
    time = ''
    if(min < 10)
    {
        time += `0${min}:`
    }
    else
    {
        time += `0${min}:`
    }
    if(sec < 10)
        time+= `0${sec}`
    else
        time += `${sec}`
    return time
}

