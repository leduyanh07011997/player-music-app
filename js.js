const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextSongBtn = $('.btn-next');
const prevSongBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const isTimeupdate = true;

var randomSongsIndexArr = [];

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
          name: "Phố Không Em",
          singer: "Thai Dinh",
          path: "./music/Pho-Khong-Em-Thai-Dinh.mp3",
          image: "./img/Pho-Khong-Em.jpg"
        },
        {
          name: "Believer",
          singer: "Image Dragons",
          path: "./music/Believer-ImagineDragons.mp3",
          image:
            "./img/believer.jpg"
        },
        {
          name: "Bức Tranh Từ Nước Mắt",
          singer: "Mr.Siro",
          path:
            "./music/BucTranhTuNuocMat-MrSiro-2741834.mp3",
          image: "./img/buc-tranh-tu-nuoc-mat.jpg"
        },
        {
          name: "Ánh Nắng Của Anh",
          singer: "Đức Phúc",
          path: "./music/AnhNangCuaAnhChoEmDenNgayMaiOst-DucPhuc-4701036.mp3",
          image:
            "./img/anh-nang-cua-anh.jpg"
        },
        {
          name: "Chút Nắng Chút Mưa",
          singer: "Hoàng Tôn",
          path: "./music/ChutNangChutMua-RikLedk.mp3",
          image:
            "./img/chut-nang-chut-mua.jpg"
        },
        {
          name: "Demons",
          singer: "Image Dragons",
          path:
            "./music/Demons-ImagineDragons.mp3",
          image:
            "./img/demons.jpg"
        },
        {
          name: "Forever Love",
          singer: "Nhiều nghệ sĩ",
          path: "./music/Forever-Love-LK-Binz-Karik-Den-BigDaddy-T-Akayz-Andree-SOOBIN-Yanbi.mp3",
          image:
            "./img/foreverlove.jpg"
        },
        {
          name: "Duyên Âm",
          singer: "Hoàng Thuỳ Linh",
          path: "./music/Duyen-Am-HoangThuyLinh.mp3",
          image:
            "./img/duyen-am.jpg"
        },
        {
          name: "Lắng Nghe Nước Mắt",
          singer: "Mr.Siro",
          path: "./music/LangNgheNuocMat-MrSiro-2558535.mp3",
          image:
            "./img/lang-nghe-nuoc-mat.jpg"
        },
        {
          name: "Why Not Me",
          singer: "Enrique Iglesias",
          path: "./music/WhyNotMe-EnriqueIglesias-3479372.mp3",
          image:
            "./img/whynotme.jpg"
        },
      ],
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
                <div 
                  class="song ${index === this.currentIndex ? 'active' : ''}" 
                  id='index${index}' 
                  data-index="${index}"
                >
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function() {
      Object.defineProperty(this,'currentSong',{
        get: function() {
          return this.songs[this.currentIndex]
        }
      })
    },
    handleEvents: function() {
      const _this = this;
      const touch = 'touchstart' || 'mousedown';

      // Xử lý khi CD chạy / dừng
      const cdThumbAnimation = cdThumb.animate({
        transform: 'rotate(360deg)'
      },{
        duration: 10000,
        iterations: Infinity,
      })
      cdThumbAnimation.pause();

      // Xử lý khi phóng to / thu nhỏ CD 
      const cdWidth = cd.offsetWidth;

      document.onscroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop;

        cd.style.width = newCdWidth>37 ? newCdWidth + 'px' : 0;
        cd.style.opacity = newCdWidth/cdWidth;
      } 

      // Xử lý khi click playBtn 
      playBtn.onclick = function() {
        if(_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
        
        // Khi song được play
        audio.onplay = function() {
          _this.isPlaying = true;
          player.classList.add('playing');
          cdThumbAnimation.play();
        }

        // khi song bị pause
        audio.onpause = function() {
          _this.isPlaying = false;
          player.classList.remove('playing');
          cdThumbAnimation.pause();
        }

        // Khi tiến độ song bị change
        audio.ontimeupdate = function() {
          if(_this.isTimeupdate) {
            const progressPercent = Math.floor(audio.currentTime/audio.duration * 100);
            progress.value = progressPercent;
          }
        }

        // Khi tua song

        progress.onmousedown = function() {
          _this.isTimeupdate = false;
        }

        progress.onmouseup = function() {
          _this.isTimeupdate = true;
        }

        progress.onchange = function(e) {
          const seekTime = e.target.value/100 * audio.duration
          audio.currentTime = seekTime;
        }
      }

      // Xử lý khi click vào nextSongBtn
      nextSongBtn.onclick = function() {
        let oldActiveSong = $('.song.active');
        if(_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.nextSong();
        }

        let currentActiveSong = $(`#index${_this.currentIndex}`)

        oldActiveSong.classList.remove('active');
        currentActiveSong.classList.add('active');
        _this.scrollToActiveSong();
        audio.play();
      }

      // Xử lý khi click vào prevSongBtn
      prevSongBtn.onclick = function() {
        let oldActiveSong = $('.song.active');

        if(_this.isRandom) {
          _this.playRandomSong();
        } else {
          _this.prevSong();
        }

        let currentActiveSong = $(`#index${_this.currentIndex}`)
        oldActiveSong.classList.remove('active');
        currentActiveSong.classList.add('active');
        _this.scrollToActiveSong();
        audio.play();
      }

      // Xử lý khi click vào randomBtn
      randomBtn.onclick = function() {
        _this.isRandom = !_this.isRandom;
        _this.setConfig('isRandom', _this.isRandom);
        this.classList.toggle('active', _this.isRandom)
      }

      // Xử lý khi click vào repeatBtn
      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat;
        _this.setConfig('isRepeat', _this.isRepeat);
        this.classList.toggle('active', _this.isRepeat)
      }

      // Xử lý khi song ended
      audio.onended = function() {
        if(_this.isRepeat) {
          audio.play()
        } else {
          nextSongBtn.click();
        }
      }

      // Xử lý khi click vào bài hát trong playlist
      playlist.onclick = function (e) {
        const songNode = e.target.closest('.song:not(.active)');
        let oldActiveSong = $('.song.active');

        if( songNode|| e.target.closest('.option')) {
          // Xử lý khi click vào song
          if(songNode) {
            _this.currentIndex = Number(songNode.dataset.index);
            oldActiveSong.classList.remove('active');
            songNode.classList.add('active');
            _this.loadCurrentSong();
            audio.play();
          }

          // Xử lý khi click vào option
          if(e.target.closest('.option')) {

          }
        }
      }
    },
    loadCurrentSong: function() {

      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
    },
    loadConfig: function() {
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
    },
    prevSong: function() {
      this.currentIndex--
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length-1;
      }
      this.loadCurrentSong();
    },
    playRandomSong: function() {
      let newIndex;
      let isDup
      
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
        if (randomSongsIndexArr.length >= this.songs.length) {
          randomSongsIndexArr = [];
        }
        isDup = randomSongsIndexArr.some(index => {
          return newIndex === index
        });
      } while (newIndex === this.currentIndex || isDup)

      randomSongsIndexArr.push(newIndex);

      console.log(randomSongsIndexArr);
      this.currentIndex = newIndex;
      this.loadCurrentSong();
    },
    playRepeatSong: function() {
      this.currentIndex--
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length-1;
      }
      this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
      if (this.currentIndex < 3) {
        setTimeout(() => {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        },300)
      } else {
        setTimeout(() => {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        },300)
      }
      
    },
    start: function() {
        // load config
        this.loadConfig();
        
        // định nghĩa các property cho object
        this.defineProperties();

        // Lắng nghe/ xử lý các sự kiện (DOM events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên lên UI khi chạy ứng dụng
        this.loadCurrentSong();

        // render playlist
        this.render();

        //Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();