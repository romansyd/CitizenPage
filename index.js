import { getAttachments } from "./services.js";

let slidesData = {};
let slides;
let slidesLenght;
const carouselTrack = document.querySelector(".carousel-track");

const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");

const indList = document.querySelector(".carousel-indicator");

// POP UP
const popup = document.querySelector('.popup');
const closeBtn = popup.querySelector('.close-btn');

let activeSlideIndex = 0;

// SLIDER

const updateInd = (ind) => {
    let indicators = document.querySelectorAll(".indicator");
    indicators.forEach((el, idx) => {
        el.classList.remove("active");
        if (idx === ind) {
            el.classList.add("active");
        }
    })
}

const updateAttachInd = (ind) => {
    const attachmentIndex = document.querySelector("#attachment-index");
    attachmentIndex.innerHTML = `${ind + 1} / ${slidesLenght}`;
}

const changeTrack = () => {
    let imgWidth = slides[activeSlideIndex].clientWidth;
    carouselTrack.style.transform = `translateX(-${activeSlideIndex * imgWidth}px)`;

}

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

const renderSlider = (idx = 0) => {
    carouselTrack.innerHTML = ``;
    activeSlideIndex = 0;
    if (idx === 0) {
        slidesData?.attachments.forEach((slide) => {
            const template = document.createElement('div')
            template.innerHTML = `
                <img src="${slide.url}" alt="">
            `;
            template.classList.add('carousel-slide');
            carouselTrack.append(template);
        })
        slidesLenght = slidesData?.attachments.length;
    }
    if (idx === 1) {
        slidesData?.outputAttachments.forEach((slide) => {
            const template = document.createElement('div')
            template.innerHTML = `
                <img src="${slide.url}" alt="">
            `;
            template.classList.add('carousel-slide');
            carouselTrack.append(template);
        })
        slidesLenght = slidesData?.attachments.length;
    }
    slides = document.querySelectorAll(".carousel-slide");
    changeTrack();
    updateInd(idx);
    updateAttachInd(0);
}

const start = () => {
    getAttachments().then((data) => {
        slidesData = JSON.parse(JSON.stringify(data))
        renderSlider();
    });
}

// POP UP

const openImage = () => {
    const popup = document.querySelector('.popup');
    const popupImg = popup.querySelector('img');
    const activeSlide = slides[activeSlideIndex];
    const activeImgSrc = activeSlide.querySelector('img').getAttribute('src');
    popupImg.setAttribute('src', activeImgSrc);
    popup.classList.add('open');
}

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.classList.remove('open');
}

const handleImageClick = e => {
    if (e.target.tagName === 'IMG') {
        openImage();
    }
}

//START

start();


// EVENT LISTENERS

indList.addEventListener("click", e => {
    let target = e.target;
    if (target.classList.contains("indicator")) {
        renderSlider(+target.dataset.index);
    }
})

nextBtn.addEventListener("click", () => {
    moveSlide("next")
});
prevBtn.addEventListener("click", () => {
    moveSlide("prev")
});

window.addEventListener("keyup", e => {
    if (e.keyCode === 37) {
        moveSlide("prev");
    } else if (e.keyCode === 39) {
        moveSlide("next");
    }
})

window.addEventListener("resize", () => changeTrack());

carouselTrack.addEventListener('click', handleImageClick);
closeBtn.addEventListener('click', closePopup);
