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
            cards[(currentCard + cards.length) % cards.length].classList.add("active");
        } else {
            cardsParent.innerHTML = `<h3 style="text-align: center;">Cards you add appear here</h3>`
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
    if(cards.length > 0) {
        cards.forEach(card => {
            card.classList.remove("active");
        })
    
        cardsContent.forEach((content) => {
            content.classList.remove("rotate");
        })
    
        currentCard = (index + cards.length) % cards.length;
        cards[currentCard].classList.add("active")
        checkLabel();
    }
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
})


document.querySelector("#question").addEventListener("focus", function() {
    document.querySelectorAll(".form-error").forEach((error) => error.textContent = "");
});

document.querySelector("#answer").addEventListener("focus", function() {
    document.querySelectorAll(".form-error").forEach((error) => error.textContent = "");
});

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
    
    if(hideBtn.checked) {
        const selected = allCards.filter((card) => card.Status !== "mastered");
        renderCards(selected);
    } else {
        renderCards(allCards);
    }
    updateList();
    checkLabel();
    alert("Flashcard successfully created");
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
    if(cards.length > 0) {
        cardsContent[currentCard].classList.toggle("rotate");
    }
});

const masterBtn = document.querySelector(".master");
const hideBtn = document.querySelector("#hide-mastered");

masterBtn.addEventListener("click", function() {
    if(hideBtn.checked) {
        cards.forEach((card, index) => {
            if(card.classList.contains("active")) {
                const selected = allCards.filter((cards) => cards.Status !== "mastered");
                selected[index].Status = "mastered";
                localStorage.setItem("storedCards", JSON.stringify(allCards))
            }
        })
    } else {
        cards.forEach((card, index) => {
            if(card.classList.contains("active")) {
                allCards[index].Status = "mastered";
                localStorage.setItem("storedCards", JSON.stringify(allCards))
            }
        })
    }

    updateSelected();
    currentCard += 1;
    changeSlide(currentCard)
})

function updateSelected() {
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
    currentCard = 0;
    updateList();
    checkLabel();
})

document.querySelector(".delete").addEventListener("click", function() {
    if(window.confirm("This will permanently delete this card")) {
        if(hideBtn.checked) {
            cards.forEach((card, index) => {
                if(card.classList.contains("active")) {
                    const selected = allCards.filter((card) => card.Status !== "mastered");
                    let number = allCards.findIndex(n => n === selected[index]);
                    if(number !== -1) {
                        allCards.splice(number, 1);
                        localStorage.setItem("storedCards", JSON.stringify(allCards));
                    }
                }
            })

            const newSelected = allCards.filter((card) => card.Status !== "mastered");
            renderCards(newSelected);
            updateList();
            checkLabel();
            if(currentCard > 1) {
                currentCard -=1
            } else {
                currentCard = 0;
            }
            changeSlide(currentCard);
        } else {
            cards.forEach((card, index) => {
                if(card.classList.contains("active")) {
                    allCards.splice(index, 1);
                }
            })

            localStorage.setItem("storedCards", JSON.stringify(allCards))
            renderCards(allCards);
            updateList();
            checkLabel();
            if(currentCard > 1) {
                currentCard -=1
            } else {
                currentCard = 0;
            }
            changeSlide(currentCard);
        }
        return true;
    }
});

function openModal() {
    document.querySelector(".overlay").classList.remove("hidden");
    document.querySelector(".edit-form").classList.remove("hidden");
}

function closeModal() {
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".edit-form").classList.add("hidden");
}

document.querySelector(".edit").addEventListener("click", openModal)
document.querySelector(".overlay").addEventListener("click", closeModal);

document.querySelector("#new-question").addEventListener("focus", function() {
    document.querySelectorAll(".new-form-error").forEach((error) => error.textContent = "");
});

document.querySelector("#new-answer").addEventListener("focus", function() {
    document.querySelectorAll(".new-form-error").forEach((error) => error.textContent = "");
});


document.querySelector(".edit-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const newQuestion = document.getElementById("new-question").value;
    const newAnswer = document.getElementById("new-answer").value;
        if(newQuestion.trim() === "") {
        document.querySelector("#new-question-error").textContent = "A question is required";
        return false;
    }
    
    if(newAnswer.trim() === "") {
        document.querySelector("#new-answer-error").textContent = "An answer is required";
        return false;
    }

    if(cards.length > 0) {
        if(hideBtn.checked) {
            const selected = allCards.filter((card) => card.Status !== "mastered");
            cards.forEach((card,index) => {
                if(card.classList.contains("active")) {
                    selected[index].Question = newQuestion;
                    selected[index].Answer = newAnswer;
                }
            });
            localStorage.setItem("storedCards", JSON.stringify(allCards));
            renderCards(selected);
            updateList();
            checkLabel();
            if(currentCard > 1) {
                currentCard -=1
            } else {
                currentCard = 0;
            }
            changeSlide(currentCard);
        } else {
            cards.forEach((card, index) => {
                if(card.classList.contains("active")) {
                    allCards[index].Question = newQuestion;
                    allCards[index].Answer = newAnswer;
                }
            })
            localStorage.setItem("storedCards", JSON.stringify(allCards));
            renderCards(allCards);
            updateList();
            checkLabel();
        }
    }
    document.querySelector(".edit-form").reset();
    closeModal();
})