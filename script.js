'use strict';
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
let currentCard = 0;
const cardsContainer = document.querySelector(".flash-card-container");
let cardsContent = document.querySelectorAll(".flash-card-content");
let cards = document.querySelectorAll(".flash-card");
const labels = document.querySelectorAll(".number");
const progress = document.querySelector(".progress-content");
const addBtn = document.querySelector(".add-btn");
const form = document.querySelector("form");
const inputs = document.querySelectorAll("input");
const cardsParent = document.querySelector(".flash-cards");

const allCards = JSON.parse(localStorage.getItem("storedCards")) || [];

function updateList() {
        cards = document.querySelectorAll(".flash-card");
        cards.forEach((card) => card.classList.remove("active"));
        cardsContent = document.querySelectorAll(".flash-card-content");
        cardsContent.forEach((content) => content.classList.remove("rotate"));
        if(cards.length > 0) {
            cards[currentCard].classList.add("active");
        } else{
            cardsParent.innerHTML = `<h3 style="text-align:>Cards you add appear here</h1>`
        }
}

// if(allCards.length < 1) {
//     prevBtn.disabled = true;
//     nextBtn.disabled = true;
// } else {
//     prevBtn.disabled = false;
//     nextBtn.disabled = false;
// }
// const 
// let isValid = true;

function renderCards(items) {

    if(!cardsParent) return;

            cardsParent.innerHTML = items.map((item) => { 
              return  `
                    <div class="flash-card">
                        <div class="flash-card-content">
                            <div class="flash-card-question">
                                <h3 class="question">${item.Question}</h3>
                                <p>Click to reveal answer</p>
                            </div>
    
                            <div class="flash-card-answer">
                                <p class="answer">${item.Answer}</p>
                            </div>
                        </div>
                    </div>
                `;
            })
            .join("");
            updateList();
}

renderCards(allCards);

function checkLabel() {

    if(cards.length > 0) {
        labels.forEach((label) => {
            label.textContent = `${currentCard + 1} of ${cards.length}`;
        });
        
        progress.style.width = `${(currentCard + 1) / cards.length * 100}%`;
    } else {
        labels.forEach((label) => {
            label.textContent = `0 0f 0`;
        })
    }
};


checkLabel();

function changeSlide(index) {
    cards.forEach(card => {
        card.classList.remove("active");
    })

    cardsContent.forEach((content) => {
        content.classList.remove("rotate");
    })

    currentCard = (index + cards.length) % cards.length;
    cards[currentCard].classList.add("active")
    checkLabel();
};


document.addEventListener("keydown", function(e) {
    if(e.key === "ArrowLeft") {
        currentCard -= 1;
        changeSlide(currentCard);
    }
    
    if(e.key === "ArrowRight") {
        currentCard += 1;
        changeSlide(currentCard);
    }

    if(e.key === "Enter") {
        cardsContent[currentCard].classList.toggle("rotate");
    }
})

form.addEventListener("submit", function(e) {
    e.preventDefault();
    const question = document.getElementById("question").value;
    const answer = document.getElementById("answer").value;
    
    if(question.trim() === "") {
        document.querySelector("#question-error").textContent = "A question is required";
        return false;
    }

    if(answer.trim() === "") {
        document.querySelector("#answer-error").textContent = "An answer is required";
        return false;
    }

    const collectedData = {
        Question: question,
        Answer: answer,
        Status: "not-mastered",
    };
    
    allCards.push(collectedData);
    localStorage.setItem("storedCards", JSON.stringify(allCards));
    
    // cardsParent.innerHTML = allCards.map((card) => {
    //     return `
    //     <div class="flash-card">
    //     <div class="flash-card-content">
    //     <div class="flash-card-question">
    //                         <h3 class="question">${card.Question}</h3>
    //                         <p>Click to reveal answer</p>
    //                     </div>
                        
    //                     <div class="flash-card-answer">
    //                     <p class="answer">${card.Answer}</p>
    //                     </div>
    //                     <div>
    //             </div>
    //     `
    // })
    
    renderCards(allCards);
    updateList();
    checkLabel();
    
    form.reset();
    // }
})

prevBtn.addEventListener("click", function() {
    currentCard -= 1;
    changeSlide(currentCard); 
});

nextBtn.addEventListener("click", function() {
    currentCard += 1;
    changeSlide(currentCard)
});

cardsContainer.addEventListener("click", function() {
    cardsContent[currentCard].classList.toggle("rotate");
});

const masterBtn = document.querySelector(".master");
const hideBtn = document.querySelector("#hide-mastered");

masterBtn.addEventListener("click", function() {
    cards.forEach((card, index) => {
        if(card.classList.contains("active")) {
            allCards[index].Status = "mastered";
            localStorage.setItem("storedCards", JSON.stringify(allCards))
            return true;
        }
    })

    updateSelected();
    updateList();
    currentCard += 1;
    changeSlide(currentCard)
})

function updateSelected() {
    let shown = []

    if(hideBtn.checked) {
        // cards.forEach((flashcard, index) => {
            //         if(!flashcard.classList.contains("mastered")) {
                //             console.log(index);
                //             shown.push(allCards[index]);
        //         }
        //     });        
        
        currentCard = 0;
        let shown = allCards.filter((card) => {
            return card.Status !== "mastered";
        })
        // cards.forEach((card, index) => {
            //     if(card.classList.contains("mastered")) {
            
            //     }
        
            // })
            
            renderCards(shown);
    } else {
        renderCards(allCards);
    }
    
    updateList();
    checkLabel();
}


hideBtn.addEventListener("change", function() {
    updateSelected();
})

function shuffleCards(array) {
    if(array.length > 1) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i));
            console.log(j);
            [array[i], array[j]] = [array[j], array[i]];
        }
    
        return array;
    }
}

document.querySelector(".shuffle").addEventListener("click", function() {
    localStorage.setItem("storedCards", JSON.stringify(shuffleCards(allCards)));
    renderCards(allCards);
})
 
document.querySelector(".reset").addEventListener("click", function() {

    allCards.map((card) => card.Status = "not-mastered");
    renderCards(allCards);
    updateList();
    checkLabel();
})