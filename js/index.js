import { getAttachments } from "./services.js";
import { Texts } from "./strings.js";

// slider variables
let sliderState = {};
let slides;
let slidesLenght;
let activeSlideIndex = 0;

//for slide by swipes
let touchstartX = 0;
let touchendX = 0;

// ticket data information

const ticket = {
    title: document.querySelector(".ticket-title"),
    opendate: document.querySelector(".ticket-opendate"),
    number: document.querySelector(".ticket-number"),
    description: document.querySelector(".ticket-description")
};

// slider elements
const carousel = document.querySelector(".carousel-container");
const carouselTrack = document.querySelector(".carousel-track");
const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");

const indList = document.querySelector(".carousel-indicator");

// POP UP
const popup = document.querySelector('.popup');
const closeBtn = popup.querySelector('.close-btn');
const popupNextBtn = document.querySelector("#popup-next-btn");
const popupPrevBtn = document.querySelector("#popup-prev-btn");

// SLIDER

const updateInd = (ind) => {
    let indicators = document.querySelectorAll(".indicator");
    indicators.forEach((el, idx) => {
        el.classList.remove("active");
        if (idx === ind) {
            sliderState = {
                ...sliderState,
                activeTab: idx
            }
            el.classList.add("active");
        }
    })
}

// Update the index shows user the "number of  current slide / all slides"
const updateAttachInd = (ind) => {
    const attachmentIndex = document.querySelector("#attachment-index");
    const shadingStrip = document.querySelector(".shading-strip");

    shadingStrip.classList.remove('shading-strip-dark');

    const { activeTab } = sliderState;
    const activeTabName = Texts.sliderTabNames[activeTab];

    //sliderState.attachments | sliderState.outputAttachments current slide is IMG
    if (sliderState[activeTabName][ind].type === 1) {
        shadingStrip.classList.add('shading-strip-dark');
    }

    attachmentIndex.innerHTML = `${ind + 1} / ${slidesLenght}`;
}

const changeTrack = () => {
    carouselTrack.style.width = `${slidesLenght * 100}%`;
    slides = document.querySelectorAll(".carousel-slide");
    let imgWidth = slides[activeSlideIndex].clientWidth;
    carouselTrack.style.transform = `translateX(-${activeSlideIndex * imgWidth}px)`;
}

// change current slide using arrow-buttons
const moveSlide = dir => {
    if (dir === "prev") {
        if (activeSlideIndex > 0) {
            activeSlideIndex--;
        } else {
            activeSlideIndex = slides.length - 1;
        }

    } else if (dir === "next") {
        if (activeSlideIndex < slides.length - 1) {
            activeSlideIndex++;
        } else {
            activeSlideIndex = 0;
        }
    }
    updateAttachInd(activeSlideIndex);
    changeTrack();
}

const appendCarouselSlides = (list = 'attachments') => {
    sliderState[list].forEach((slide, i) => {
        const template = document.createElement('div');
        template.classList.add('carousel-slide');
        template.append(createTemplateByType(slide, i));
        carouselTrack.append(template);
        template.innerHTML = createTemplateByType(slide, i);
        if (slide.type === 3 || slide.type === 2) {
            template.querySelector('source').addEventListener("error", (e) => {
                const videoToLink = { ...slide, type: 4 }
                template.innerHTML = `
                <div class="converted">
                    <span>${Texts.Err_media}</span>
                    ${createTemplateByType(videoToLink, i)}
                </div>
                `
            });
        }
        if (slide.type === 3) {
            const player = template.querySelector('video'),
                playButton = template.querySelector('.playpause');

            player.addEventListener('touchstart', () => {
                playPauseHandler(player, playButton);
            })
            player.addEventListener('click', (e) => {
                e.preventDefault();
                playPauseHandler(player, playButton);
            })
        }
        if (slide.type === 2) {
            /** Implementation of the presentation of the audio player */

            const playIconContainer = template.querySelector('.playpause');
            const audioPlayerContainer = template.querySelector('.audio-container');
            const seekSlider = template.querySelector('.seek-slider');
            let playState = 'play';

            playIconContainer.addEventListener('click', () => {
                if (playState === 'play') {
                    audio.play();
                    requestAnimationFrame(whilePlaying);
                    playState = 'pause';
                } else {
                    audio.pause();
                    cancelAnimationFrame(raf);
                    playState = 'play';
                }
            });

            const showRangeProgress = (rangeInput) => {
                if (rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
                else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
            }

            seekSlider.addEventListener('input', (e) => {
                showRangeProgress(e.target);
            });


            /** Implementation of the functionality of the audio player */

            const audio = template.querySelector('audio');
            const durationContainer = template.querySelector('.duration');
            const currentTimeContainer = template.querySelector('.current-time');
            let raf = null;

            const calculateTime = (secs) => {
                const minutes = Math.floor(secs / 60);
                const seconds = Math.floor(secs % 60);
                const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
                return `${minutes}:${returnedSeconds}`;
            }

            const displayDuration = () => {
                durationContainer.textContent = calculateTime(audio.duration);
            }

            const setSliderMax = () => {
                seekSlider.max = Math.floor(audio.duration);
            }

            const displayBufferedAmount = () => {
                const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
                audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
            }

            const whilePlaying = () => {
                seekSlider.value = Math.floor(audio.currentTime);
                currentTimeContainer.textContent = calculateTime(seekSlider.value);
                audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
                raf = requestAnimationFrame(whilePlaying);
            }

            if (audio.readyState > 0) {
                displayDuration();
                setSliderMax();
                displayBufferedAmount();
            } else {
                audio.addEventListener('loadedmetadata', () => {
                    displayDuration();
                    setSliderMax();
                    displayBufferedAmount();
                });
            }

            audio.addEventListener('progress', displayBufferedAmount);

            seekSlider.addEventListener('input', () => {
                currentTimeContainer.textContent = calculateTime(seekSlider.value);
                if (!audio.paused) {
                    cancelAnimationFrame(raf);
                }
            });

            seekSlider.addEventListener('change', () => {
                audio.currentTime = seekSlider.value;
                if (!audio.paused) {
                    requestAnimationFrame(whilePlaying);
                }
            });
        }
        carouselTrack.append(template);
    })
}

const playPauseHandler = (player, playButton) => {
    if (player.paused && !player.ended) {
        console.log('hide');
        playButton.classList.add('hide');
        player.play();
    } else {
        console.log('play');
        playButton.classList.remove('hide');
        player.pause();
    }
}

const createTemplateByType = (slide, i) => {
    switch (slide?.type) {
        case 1:
            return `
            <img src="${slide.url}" alt="">
            `;
        case 2:
            return `
                <div class="media-wrapper audio-container">
                    <audio preload="metadata">
                        <source src="${slide.url}" type="audio/mpeg">
                        <source src="${slide.url}" type="audio/mp3">
                        <source src="${slide.url}" type="audio/ogg">
                        Your browser does not support the audio tag.</audio>
                    <img src="./img/icons/play.png" class="playpause">
                    <div class="audio-background">
                        <div class="audio-background-col per30"></div>
                        <div class="audio-background-col per50"></div>
                        <div class="audio-background-col per70"></div>
                        <div class="audio-background-col per40"></div>

                        <div class="audio-background-col per30"></div>
                        <div class="audio-background-col per50"></div>
                        <div class="audio-background-col per70"></div>
                        <div class="audio-background-col per40"></div>
                    </div>

                    <div class="audio-controls">
                        <span class="time current-time">0:00</span>
                        <input type="range" class="seek-slider" max="100" value="0">
                        <span class="time duration">0:00</span>
                    </div>
                </div>
                `;
        case 3:
            return `
                <div class="media-wrapper">
                    <video controls dataset="paused">
                        <source src="${slide.url}" type="video/mp4">
                        <source src="${slide.url}" type="video/ogg">
                        Your browser does not support the video tag.
                    </video>
                    <div class="controls">
                        <img src="./img/icons/play.png" class="playpause">
                    </div>
                </div>
        `;
        case 4:
            return `
            <a href="${slide.url}" download>
                <img src="./img/icons/download.png" alt="">
                <p>הורד את הקובץ</p>
            </a>
            `;
        default:
            break;
    }
}

const renderSlider = (idx = 0) => {
    carouselTrack.innerHTML = ``;
    activeSlideIndex = 0;
    if (idx === 0 && sliderState.attachments !== undefined) {
        appendCarouselSlides('attachments');
        slidesLenght = sliderState?.attachments.length;
        changeTrack();
    }
    if (idx === 1 && sliderState.outputAttachments !== undefined) {
        appendCarouselSlides('outputAttachments');
        slidesLenght = sliderState?.outputAttachments.length;
        changeTrack();
    }
    updateInd(idx);
    updateAttachInd(0);
}

// set ticket info in fields in section info 
const setTicketInfo = (data) => {
    const { activeTab } = sliderState;
    const activeTabName = Texts.infoTabNames[activeTab];
    const infoData = data[activeTabName];

    if (Object.keys(infoData).length !== 0) {
        ticket.number.textContent = infoData.ticketNo;
        ticket.description.textContent = infoData.descr;
        ticket.opendate.textContent = infoData.openDate;
    }
}

const errorHandler = (data) => {
    if (data.code === undefined) {
        carousel.classList.remove("hide");
        renderSlider();
        setTicketInfo(data);
    } else {
        ticket.title.textContent = data?.message;
        const infoField = document.querySelectorAll('.info-field');
        infoField.forEach(el => el.innerHTML = ``);
        carousel.classList.add("hide");
    }
}

const offlineModeHandler = () => {
    const main = document.querySelector('main');
    main.innerHTML = `<h2 class="ticket-title">${Texts.Err_offline_mode}</h1>`;
}

// fetch post data here and do first render
const start = () => {
    getAttachments().then((data) => {
        sliderState = JSON.parse(JSON.stringify(data));
        errorHandler(data);
        window.removeEventListener('offline', offlineModeHandler, true);
    });
}

// POP UP
const openMedia = () => {
    const { activeTab } = sliderState;
    const activeTabName = Texts.sliderTabNames[activeTab];

    if (sliderState[activeTabName][activeSlideIndex].type === 1) {
        openImage();
    }
    if (sliderState[activeTabName][activeSlideIndex].type === 2) {
        openAudio();
    }
    if (sliderState[activeTabName][activeSlideIndex].type === 3) {
        openVideo();
    }
    if (sliderState[activeTabName][activeSlideIndex].type === 4) {
        closePopup();
    }
}

const openImage = () => {
    const popup = document.querySelector('.popup');
    const popupImg = popup.querySelector('.popup-img');
    const activeSlide = slides[activeSlideIndex];
    const activeImgSrc = activeSlide.querySelector('img').getAttribute('src');
    popupImg.setAttribute('src', activeImgSrc);
    popup.classList.add('open');
}
const openVideo = () => {
    const id = activeSlideIndex;
    const video = document.getElementById(`video_${id}`);
    console.log(video);
}
const openAudio = () => {
    const id = activeSlideIndex;
    const audio = document.getElementById(`audio_${id}`);
    console.log(audio);
}

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.classList.remove('open');
}

const handleImageClick = e => {
    if (e.target.tagName === 'IMG' && !e.target.classList.contains('playpause')) {
        openImage();
    }
}

//SWIPES

function handleSwipe() {
    if (touchendX < touchstartX && (touchstartX - touchendX) > 80) {
        moveSlide("next");
    }
    if (touchendX > touchstartX && (touchendX - touchstartX) > 80) {
        moveSlide("prev");
    }
}

//START

start();

// EVENT LISTENERS

window.addEventListener('offline', offlineModeHandler, true);

indList.addEventListener("click", e => {
    let target = e.target;
    if (target.classList.contains("indicator")) {
        renderSlider(+target.dataset.index);
    }
})

nextBtn.addEventListener("click", () => {
    moveSlide("next");
});
prevBtn.addEventListener("click", () => {
    moveSlide("prev");
});

popupNextBtn.addEventListener("click", () => {
    moveSlide("next");
    openMedia();
});

popupPrevBtn.addEventListener("click", () => {
    moveSlide("prev");
    openMedia();
});


carouselTrack.addEventListener('click', handleImageClick);
closeBtn.addEventListener('click', closePopup);

popup.addEventListener('click', (e) => {
    if (e.target.classList.value === "popup open") {
        closePopup();
    }
})

window.addEventListener("keyup", e => {
    if (e.keyCode === 37) {
        moveSlide("prev");
    } else if (e.keyCode === 39) {
        moveSlide("next");
    }
});

carousel.addEventListener("touchstart", (event) => {
    touchstartX = event.changedTouches[0].screenX;
});

carousel.addEventListener("touchend", (event) => {
    touchendX = event.changedTouches[0].screenX;
    handleSwipe();
});

window.addEventListener("resize", () => changeTrack());

