const slides = document.querySelectorAll(".carousel-slide");
const attachmentIndex = document.querySelector("#attachment-index");
const carouselTrack = document.querySelector(".carousel-track");

const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");

const indList = document.querySelector(".carousel-indicator");


let activeSlideIndex = 0;


const updateInd = () => {
    let indicators = document.querySelectorAll(".indicator");
    indicators.forEach((el, idx) => {
        el.classList.remove("active");
        attachmentIndex.textContent = `${+activeSlideIndex + 1} / 2`
        if (idx === activeSlideIndex) {
            el.classList.add("active");
        }
    })
}

const changeTrack = () => {
    let imgWidth = slides[activeSlideIndex].clientWidth;
    carouselTrack.style.transform = `translateX(-${activeSlideIndex * imgWidth}px)`;
    updateInd();
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
    changeTrack();
}

const moveSlides = idx => {
    let diff = idx - activeSlideIndex;
    if (diff >= 0) {
        for (let i = 0; i < diff; i++) {
            moveSlide("next");
        }
    } else {
        diff *= -1;
        for (let i = 0; i < diff; i++) {
            moveSlide("prev");
        }
    }
}

indList.addEventListener("click", e => {
    let target = e.target;
    if (target.classList.contains("indicator")) {
        moveSlides(target.dataset.index);
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

const popup = document.querySelector('.popup');
const closeBtn = popup.querySelector('.close-btn');

carouselTrack.addEventListener('click', handleImageClick);
closeBtn.addEventListener('click', closePopup);
