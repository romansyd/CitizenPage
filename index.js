import { getAttachments } from "./services.js";

// slider variables
let sliderState = {};
let slides;
let slidesLenght;
let activeSlideIndex = 0;

// ticket data information

const ticket = {
    opener: document.querySelector(".ticket-opener"),
    opendate: document.querySelector(".ticket-opendate"),
    number: document.querySelector(".ticket-number"),
    description: document.querySelector(".ticket-description")
};

// slider elements
const carouselTrack = document.querySelector(".carousel-track");
const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");

const indList = document.querySelector(".carousel-indicator");

// POP UP
const popup = document.querySelector('.popup');
const closeBtn = popup.querySelector('.close-btn');

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

// Update the index shows user the "number of  current slide / all slides"
const updateAttachInd = (ind) => {
    const attachmentIndex = document.querySelector("#attachment-index");
    attachmentIndex.innerHTML = `${ind + 1} / ${slidesLenght}`;
}

const changeTrack = () => {
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
    sliderState[list].forEach((slide) => {
        const template = document.createElement('div');
        template.classList.add('carousel-slide');
        template.innerHTML = createTemplateByType(slide);
        carouselTrack.append(template);
    })
}

const createTemplateByType = (slide) => {
    switch (slide?.type) {
        case 1:
            return `
            <img src="${slide.url}" alt="">
            `;
        case 2:
            return `
            <audio controls>
                <source src="${slide.url}" type="video/mpeg">
                <source src="${slide.url}" type="video/ogg">
                Your browser does not support the audio tag.
            </audio>
            `;
        case 3:
            return `
            <video controls>
                <source src="${slide.url}" type="video/mp4">
                <source src="${slide.url}" type="video/ogg">
                Your browser does not support the video tag.
            </video>
            `;
        case 4:
            return`
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
    if (idx === 0) {
        appendCarouselSlides('attachments');
        slidesLenght = sliderState?.attachments.length;
    }
    if (idx === 1) {
        appendCarouselSlides('outputAttachments');
        slidesLenght = sliderState?.outputAttachments.length;
    }
    carouselTrack.style.width = `${slidesLenght * 100}%`;
    slides = document.querySelectorAll(".carousel-slide");
    changeTrack();
    updateInd(idx);
    updateAttachInd(0);
}

// set ticket info in fields in section info 
const setTicketInfo = (data) => {
    ticket.number.textContent = `${data.ticketNo} :מס' פנייה`;
    ticket.description.textContent = `${data.descr} :תיאור פנייה`;
    ticket.opendate.textContent = `${data.openDate} :פתיחת פנייה`;
    ticket.opener.textContent = data.openerName;
}

// fetch post data here and do first render
const start = () => {
    getAttachments().then((data) => {
        sliderState = JSON.parse(JSON.stringify(data));
        renderSlider();
        setTicketInfo(data.data);
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
    moveSlide("next");
});
prevBtn.addEventListener("click", () => {
    moveSlide("prev");
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
