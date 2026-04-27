'use strict';
let previous;
let crossDelete;
let crossEdit;
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
let colors = ["blue", "purple", "#ffc0f2"];
let colorCover = ["white", "white", "black"];
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
            cardsContainer.style.border = "none";
            cardsContainer.style.justifyContent = "flex-start";
            document.querySelector(".category-title").style.display = "block";
        } else {
            cardsParent.innerHTML = `
            <div class="message" style="line-height: 2;">
                <h2 style="text-align: center; font-family: serif; color: black;">No cards to study</h2>
                <h4 style="text-align: center; color: #626262; font-weight: 400; line-height: 1.5;">Adjust your filters or create a new card to get started</h4>
            </div>
            `
            cardsContainer.style.backgroundColor = "#f9e4c8";
            cardsContainer.style.border = "1.5px dashed grey";
            cardsContainer.style.height = "266px";
            document.querySelector(".category-title").style.display = "none";
            cardsContainer.style.justifyContent = "center";
        }
        setTimeout(updateContent, 10); 
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
                if(!item.known) item.known = 0;
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
            
    if(cards.length < 1) {
        document.querySelector(".edit").disabled = true;
        document.querySelector(".reset").disabled = true;
        document.querySelector(".master").disabled = true;
        document.querySelector(".delete").disabled = true;
        document.querySelector(".shuffle").disabled = true;
        nextBtn.disabled = true;
        prevBtn.disabled = true;
    } else {
        document.querySelector(".edit").disabled = false;
        document.querySelector(".reset").disabled = false;
        document.querySelector(".master").disabled = false;
        document.querySelector(".delete").disabled = false;
        document.querySelector(".shuffle").disabled = false;
        nextBtn.disabled = false;
        prevBtn.disabled = false;
    }
}

renderCards(allCards);

function checkLabel() {

    if(cards.length > 0) {
        labels.forEach((label) => {
            label.textContent = `${(currentCard + 1)} of ${cards.length}`;
        });
        
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
        checkTitle();
        renderKnown();
        renderColors();
        setTimeout(updateContent, 10); 
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

document.querySelector("#category").addEventListener("focus", function() {
    document.querySelectorAll(".form-error").forEach((error) => error.textContent = "");
})

form.addEventListener("submit", function(e) {
    e.preventDefault();
    const question = document.getElementById("question").value;
    const answer = document.getElementById("answer").value;
    const category = document.getElementById("category").value
    
    if(question.trim() === "") {
        document.querySelector("#question-error").textContent = "A question is required";
        return false;
    }
    
    if(answer.trim() === "") {
        document.querySelector("#answer-error").textContent = "An answer is required";
        return false;
    }

    if(category.trim() === "") {
        document.querySelector("#category-error").textContent = "A category is required";
        return false;
    }

    const collectedData = {
        Question: question,
        Answer: answer,
        Status: "not-mastered",
        category: category,
        known: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
    };
    
    allCards.push(collectedData);
    localStorage.setItem("storedCards", JSON.stringify(allCards));
    updateCategory();
    renderGroups();
    
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
    if(document.querySelector(".content-control").innerHTML === "All category") {
        if(hideBtn.checked) {
            const selected = allCards.filter((card) => card.Status !== "mastered");
            renderCards(selected);
            renderAllCards(selected);
        } else {
            renderCards(allCards);
            renderAllCards(allCards);
        }
    } else {
        renderCards(groups[Object.keys(groups)[0]]);
        renderAllCards(groups[Object.keys(groups)[0]]);
    }
    updateList();
    updateCategory();
    checkLabel();
    checkTitle();
    renderKnown();
    renderColors();
    alert("Flashcard successfully created");
    form.reset();
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
    if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {

        if(hideBtn.checked) {
            cards.forEach((card, index) => {
                if(card.classList.contains("active")) {
                    const selected = allCards.filter((cards) => cards.Status !== "mastered");
                    if(selected[index].known >= 5) {
                        selected[index].known = 5;
                        selected[index].Status = "mastered";
                    } else {
                        selected[index].known += 1;
                        selected[index].status !="mastered";
                        if(selected[index].known === 5) {
                            selected[index].Status = "mastered";
                        }
                    }

                    localStorage.setItem("storedCards", JSON.stringify(allCards))
                }
            })
        } else {
            cards.forEach((card, index) => {
                if(card.classList.contains("active")) {
                    if(allCards[index].known === 5) {
                        allCards[index].Status = "mastered";
                    } else {
                        allCards[index].known += 1;
                        allCards[index].Status = "not-mastered";
                        if(allCards[index].known === 5) {
                            allCards[index].Status = "mastered";
                        }
                    }
                    localStorage.setItem("storedCards", JSON.stringify(allCards));
                }
            })

        }

        updateSelected();
        currentCard += 1;
        changeSlide(currentCard)
    } else {
        if(hideBtn.checked) {
            cards.forEach((card, i) => {
                if(card.classList.contains("active")) {
                    const data = document.querySelector(".content-control").textContent.slice(0, -1);
                    const category = groups[data]
                    const required = category.filter(c => c.Status !== "mastered");
                    const index = allCards.indexOf(required[i]);
                    if(required[i].known === 5) {
                        required[i].Status = "mastered";
                        allCards[index].Status = "mastered";
                    } else {
                        required[i].known += 1;
                        required[i].Status = "not-mastered";
                        if(required[i].known === 5) {
                            required[i].Status = "mastered";
                            allCards[index].Status = "mastered";
                        }
                    }
                    localStorage.setItem("storedCards", JSON.stringify(allCards));
                }
            });
        } else {
            cards.forEach((card, i) => {
                if(card.classList.contains("active")) {
                    const data = document.querySelector(".content-control").textContent.slice(0, -1);
                    const category = groups[data]
                    const index = allCards.indexOf(category[i]);
                    if(category[i].known === 5) {
                        category[i].Status = "mastered";
                        allCards[index].Status = "mastered";
                    } else {
                        category[i].known += 1;
                        category[i].Status = "not-mastered";
                        if(category[i].known === 5) {
                            category[i].Status = "mastered";
                            allCards[index].Status = "mastered";
                        }
                    }
                    localStorage.setItem("storedCards", JSON.stringify(allCards));
                }
            })
        }
        updateSelected();
        currentCard += 1;
        changeSlide(currentCard);
    }

})

function updateSelected() {
    if(document.querySelector(".current").textContent === "Study Mode") {
        if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
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
            checkTitle();
            renderKnown();
            renderColors();
        } else {
            if(hideBtn.checked) {
                const data = document.querySelector(".content-control").textContent.slice(0, -1);
                const category = groups[data];
                currentCard = 0;
                let shown = category.filter((card) => {
                    return card.Status !== "mastered";
                });
    
                renderCards(shown);
                renderKnown();
            } else {
                const data = document.querySelector(".content-control").textContent.slice(0, -1);
                const category = groups[data];
                renderCards(category);
            }
            updateList();
            checkLabel();
            checkTitle();
            renderKnown();
            renderColors();
        }
    } else {
        if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
            if(hideBtn.checked) {
                // cards.forEach((flashcard, index) => {
                    //         if(!flashcard.classList.contains("mastered")) {
                        //             console.log(index);
                        //             shown.push(allCards[index]);
                //         }
                //     });        
                
                let shown = allCards.filter((card) => card.Status !== "mastered");
                // cards.forEach((card, index) => {
                    //     if(card.classList.contains("mastered")) {
                    
                    //     }
                
                    // })
                    
                    renderAllCards(shown);
            } else {
                    renderAllCards(allCards);
            }
            
            // updateList();
            // checkLabel();
            // checkTitle();
            // renderKnown();
            renderColors();
        } else {
            if(hideBtn.checked) {
                const data = document.querySelector(".content-control").textContent.slice(0, -1);
                const category = groups[data];
                currentCard = 0;
                let shown = category.filter((card) => {
                    return card.Status !== "mastered";
                });
    
                renderAllCards(shown);
                renderKnown();
            } else {
                const data = document.querySelector(".content-control").textContent.slice(0, -1);
                const category = groups[data];
                renderAllCards(category);
            }
            updateList();
            checkLabel();
            checkTitle();
            renderKnown();
            renderColors();
        }
    }

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

        return array
    }

    return array;
}

document.querySelector(".shuffle").addEventListener("click", function() {
    if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
        if(hideBtn.checked) {
            let indexToFilter = []
            const required = allCards.filter((card, index) => {
                if(card.category !== "mastered") {
                    indexToFilter.push(index);
                    return card;
                }
            });
            const shuffled = shuffleCards(required);
            const newCards = allCards;
            indexToFilter.forEach((index, i) => {
                newCards[index] = shuffled[i];
            });
            localStorage.setItem("storedCards", JSON.stringify(newCards));
            updateList();
            updateSelected();
            checkTitle();
        } else {
            localStorage.setItem("storedCards", JSON.stringify(shuffleCards(allCards)));
            renderCards(allCards);
            checkTitle();
            renderAllCards(allCards);
        }
    } else {
        const data = document.querySelector(".content-control").textContent.slice(0, -1);
        let category = groups[data];
        category = shuffleCards(category);
        renderCards(category);
        renderAllCards(category);
        renderColors();
    }
})
 
document.querySelector(".reset").addEventListener("click", function() {
    if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
        // allCards.map((card) => {
            // card.Status = "not-mastered";
            // card.known = 0;
        // } )
        if(hideBtn.checked) {
            const filtered = allCards.filter((card) => card.Status !== "mastered");
            cards.forEach((card, i) => {
                if(card.classList.contains("active")) {
                    filtered[i].Status = "not-mastered";
                    const index = allCards.indexOf(filtered[i]);
                    filtered[i].known = 0;
                    allCards[index].Status = "not-mastered";
                    allCards[index].known = 0;
                }
            })
            
            renderCards(allCards);
            renderKnown();
            localStorage.setItem("storedCards", JSON.stringify(allCards));
        } else {
            cards.forEach((card, index) => {
                if(card.classList.contains("active")) {
                    allCards[index].Status = "not-mastered";
                    allCards[index].known = 0;
                }
            })
            
            renderCards(allCards);
            renderKnown();
            localStorage.setItem("storedCards", JSON.stringify(allCards));
        }
    } else {
        if(hideBtn.checked) {
            const data = document.querySelector(".content-control").textContent.slice(0, -1);
            const category = groups[data];
            const filtered = category.filter((card, i) => card.Status = "not-mastered");
            
            cards.forEach((card, i) => {
                if(card.classList.contains("active")) {
                    filtered[i].Status = "not-mastered";
                    const index = allCards.indexOf(filtered[i]);
                    filtered[i].known = 0;
                    allCards[index].Status = "not-mastered";
                    allCards[index].known = 0;
                }
            })
            renderCards(filtered);
            localStorage.setItem("storedCards", JSON.stringify(allCards));
        } else {
            const data = document.querySelector(".content-control").textContent.slice(0, -1);
            const category = groups[data];
            cards.forEach((card, i) => {
                if(card.classList.contains("active")) {
                    category[i].Status = "not-mastered";
                    category[i].known = 0;
                    const index = allCards.indexOf(category[i]);
                    allCards[index].Status = "not-mastered";
                    allCards[index].known = 0;
                }
            })
            renderCards(category);
            renderKnown();
            localStorage.setItem("storedCards", JSON.stringify(allCards));
        }
    }
    renderKnown();
});

function openDeleteModal() {
    document.querySelector(".overlay").classList.remove("hidden");
    document.querySelector(".delete-modal").classList.remove("hidden");
}

function closeDeleteModal() {
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".delete-modal").classList.add("hidden");
}

document.querySelector(".delete").addEventListener("click", openDeleteModal);
document.querySelector(".overlay").addEventListener("click", closeDeleteModal);
document.querySelector("#noBtn").addEventListener("click", closeDeleteModal);

document.querySelector("#yesBtn").addEventListener("click", function(e) {
    e.preventDefault();
    if(document.querySelector(".current").textContent === "Study Mode") {
        if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
    
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
                updateCategory();
                renderGroups();
                checkLabel();
                if(currentCard > 1) {
                    currentCard -=1
                } else {
                    currentCard = 0;
                }
                changeSlide(currentCard);
            }
    
            updateCategory();
            
        } else {
            cards.forEach((card, i) => {
                if(card.classList.contains("active")) {
                    const data = document.querySelector(".content-control").textContent.slice(0, -1);
                    const category = groups[data];
                    const index = allCards.indexOf(category[i]);
                    allCards.splice(index, 1);
                    category.splice(i, 1);
                    localStorage.setItem("storedCards", JSON.stringify(allCards));
                };
    
                renderCards(allCards)
                updateCategory();
                renderGroups();
                checkLabel();
            })
        }
    } else {
        const all = Array.from(document.querySelectorAll(".inline-delete"));
        if (!crossDelete) {
            return
        }
        const index = all.indexOf(crossDelete);
        allCards.splice(index, 1);;
        localStorage.setItem("storedCards", JSON.stringify(allCards));
        renderCards(allCards);
        renderAllCards(allCards);
        renderColors();
    }
        renderKnown();
        closeDeleteModal();
    });

function openModal() {
    let newQuestion = document.getElementById("new-question").value;
    let newAnswer = document.getElementById("new-answer").value;
    let newCategory = document.getElementById("new-category").value;

    if(cards.length > 0) {
        if(document.querySelector(".current").textContent === "Study Mode") {
            
            if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
    
                if(hideBtn.checked) {
                    const selected = allCards.filter((card) => card.Status !== "mastered");
                    cards.forEach((card,index) => {
                        if(card.classList.contains("active")) {
                            newQuestion = selected[index].Question
                            newAnswer = selected[index].Answer;
                            newCategory = selected[index].category
                        }
                    });
                } else {
                    cards.forEach((card, index) => {
                        if(card.classList.contains("active")) {
                            newQuestion = allCards[index].Question;
                            newAnswer = allCards[index].Answer;
                            newCategory = allCards[index].category;
                        }
                    })
                }
            } else {
                if(hideBtn.checked) {
                    const data = document.querySelector(".content-control").textContent.slice(0, -1);
                    const category = groups[data];
                    const filtered = category.filter((c) => c.Status !== "mastered");
                    cards.forEach((card, i) => {
                         const index = allCards.indexOf(filtered[i]);
                         if(card.classList.contains("active")) {
                            newQuestion = allCards[index].Question;
                            newAnswer = allCards[index].Answer;
                            newCategory = allCards[index].category;
                        }
                    })
                } else {
                    cards.forEach((card, i) => {
                        const data = document.querySelector(".content-control").textContent.slice(0, -1);
                        const category = groups[data];
                        if(card.classList.contains("active")) {
                            const index = allCards.indexOf(category[i]);
                            newQuestion = allCards[index].Question;
                            newAnswer = allCards[index].Answer;
                            newCategory = allCards[index].category;
                        }
                    })
                } 
            }
        } else {
            const all = Array.from(document.querySelectorAll(".inline-edit"));
            if(!crossEdit) {
                return;
            };

            const index = all.indexOf(crossEdit);
            newQuestion = allCards[index].Question;
            newAnswer = allCards[index].Answer;
            newCategory = allCards[index].category;
        }
    }

    document.getElementById("new-question").value = newQuestion;
    document.getElementById("new-answer").value = newAnswer;
    document.getElementById("new-category").value = newCategory;
    document.querySelector(".overlay").classList.remove("hidden");
    document.querySelector(".edit-form").classList.remove("hidden");
}

function closeModal() {
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".edit-form").classList.add("hidden");
}

document.querySelector(".edit").addEventListener("click", openModal);
document.querySelector(".overlay").addEventListener("click", closeModal);

document.querySelector("#new-question").addEventListener("focus", function() {
    document.querySelectorAll(".new-form-error").forEach((error) => error.textContent = "");
});

document.querySelector("#new-answer").addEventListener("focus", function() {
    document.querySelectorAll(".new-form-error").forEach((error) => error.textContent = "");
});

document.querySelector("#new-category").addEventListener("focus", function(e) {
    document.querySelectorAll(".new-form-error").forEach((error) => error.textContent = "");
})

document.querySelector(".edit-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const newQuestion = document.getElementById("new-question").value;
    const newAnswer = document.getElementById("new-answer").value;
    const newCategory = document.getElementById("new-category").value;
    
    if(newQuestion.trim() === "") {
        document.querySelector("#new-question-error").textContent = "A question is required";
        return false;
    }
    
    if(newAnswer.trim() === "") {
        document.querySelector("#new-answer-error").textContent = "An answer is required";
        return false;
    }

    if(newCategory.trim() === "") {
        document.querySelector("#new-category-error").textContent = "A category is required";
        return false;
    } 

    if(cards.length > 0) {
        // if(document.querySelector(".current").textContent === "Study Mode") {
            
            if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
    
                if(hideBtn.checked) {
                    const selected = allCards.filter((card) => card.Status !== "mastered");
                    cards.forEach((card,index) => {
                        if(card.classList.contains("active")) {
                            selected[index].Question = newQuestion;
                            selected[index].Answer = newAnswer;
                            selected[index].category = newCategory;
                        }
                    });
                    localStorage.setItem("storedCards", JSON.stringify(allCards));
                    renderCards(selected);
                    renderAllCards(selected);
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
                            allCards[index].category = newCategory;
                        }
                    })
                    localStorage.setItem("storedCards", JSON.stringify(allCards));
                    renderCards(allCards);
                    renderAllCards(allCards);
                    updateList();
                    checkLabel();
                }
            } else {
                if(hideBtn.checked) {
                    const data = document.querySelector(".content-control").textContent.slice(0, -1);
                    const category = groups[data];
                    const filtered = category.filter((c) => c.Status !== "mastered");
                    cards.forEach((card, i) => {
                         const index = allCards.indexOf(filtered[i]);
                         if(card.classList.contains("active")) {
                            allCards[index].Question = newQuestion;
                            allCards[index].Answer = newAnswer;
                            allCards[index].category = newCategory;
                            filtered[i].Question = newQuestion;
                            filtered[i].Answer = newAnswer;
                            filtered[i].category = newCategory;
                        }
                    })

                    localStorage.setItem("storedCards", JSON.stringify(allCards));
                    const selected = allCards.filter((card) => card.Status !== "mastered");
                    renderCards(selected);
                    renderAllCards(selected);
                    updateCategory();
                    renderGroups();
                    updateList();
                    checkLabel();
                } else {
                    cards.forEach((card, i) => {
                        const data = document.querySelector(".content-control").textContent.slice(0, -1);
                        const category = groups[data];
                        if(card.classList.contains("active")) {
                            const index = allCards.indexOf(category[i]);
                            allCards[index].Question = newQuestion;
                            allCards[index].Answer = newAnswer;
                            allCards[index].category = newCategory;
                            category[i].Question = newQuestion;
                            category[i].Answer = newAnswer;
                            category[i].category = newCategory;
                        }
                    })
                    localStorage.setItem("storedCards", JSON.stringify(allCards));
                    renderCards(allCards);
                    renderAllCards(allCards);
                    updateCategory();
                    renderGroups();
                    updateList();
                    checkLabel();
                } 
            }
        // } else {
        //     const all = Array.from(document.querySelectorAll(".inline-edit"));
        //     if(!crossEdit) {
        //         return;
        //     }
        //     const index = all.indexOf(crossEdit);
        //     allCards[index].Question = newQuestion;
        //     allCards[index].Answer = newAnswer;
        //     allCards[index].category = newCategory;
        //     localStorage.setItem("storedCards", JSON.stringify(allCards));
        //     renderCards(allCards);
        //     renderAllCards();
        //     renderColors(); 
        // }
    }
    document.querySelector(".edit-form").reset();
    closeModal();
});

let groups = {}

function updateCategory() {
    groups = {"All category": allCards};
    
    for(let card of allCards) {
        let categoryName = card.category;
    
        if(!groups[categoryName]) {
            groups[categoryName] = [];
        }
    
        groups[categoryName].push(card);
    };
    
}

// function checkCategory() {
//     groups = {"All category" : allCards};

//     for(let card of allCards) {
//         let categoryName = card.category;
//         if(!groups[categoryName]) {
//             groups[categoryName] = []
//         }
//     }
// }

updateCategory();


function renderGroups() {
    const menu = document.getElementById("category-menu");
    
    menu.innerHTML = Object.keys(groups).map((group) => {
        return `<p class="single-category">${group}</p>`;
    }).join("");

    // Always make the first one active after a swap
    document.querySelectorAll(".single-category").forEach((category) => {
        category.classList.remove("content-control");
    })

    if(document.querySelectorAll(".single-category").length  <= 1) {
        document.querySelector(".menu-content").innerHTML += `<h4 class="single-category" style="pointer-events: none;">empty</h4>`
    }

    const firstCategory = menu.querySelector(".single-category");
    if (firstCategory) {
        firstCategory.classList.add("content-control");
        firstCategory.innerHTML += `<span class="arrow">&#9660;</span>`
    }
    
    closeCategory();

    updateWidth();
    checkTitle();
    // renderColors();
}

renderGroups();

document.getElementById("category-menu").addEventListener("click", (e) => {
if (e.target.classList.contains("single-category") && !e.target.classList.contains("content-control")) {
    const allCategories = Array.from(document.querySelectorAll(".single-category"));
    const clickedIndex = allCategories.indexOf(e.target)
    const activeIndex = allCategories.findIndex((category) => category.classList.contains("content-control"));
    currentCard = 0;
    updateList();
    triggerCategory(e.target, clickedIndex, activeIndex);
}})

function triggerCategory(card, index, activeIndex) {
    if(document.querySelector(".current").textContent === "Study Mode") {

        if(hideBtn.checked) {
            let selectedCategory = groups[card.innerHTML];
            const involved = Object.keys(groups)
            let categoryName = involved[index];
            [involved[activeIndex], involved[index]] = [involved[index], involved[activeIndex]];
            let newGroups = {};
            for (let keys of involved) {
                newGroups[keys] = groups[keys];
            }
        
            groups = newGroups;
            const data = groups[involved[0]]
            const required = data.filter(((card) => card.Status !== "mastered"));
            renderCards(required);
            updateList();
            checkLabel();
            renderGroups();
            changeSlide(currentCard);
            updateSelected();
            renderKnown();
        } else {
            let selectedCategory = groups[card.innerHTML];
            const involved = Object.keys(groups)
            let categoryName = involved[index];
            [involved[activeIndex], involved[index]] = [involved[index], involved[activeIndex]];
            let newGroups = {};
            for (let keys of involved) {
                newGroups[keys] = groups[keys];
            }
            groups = newGroups;
            renderGroups();
            renderCards(groups[involved[0]]);
            updateList();
            checkLabel();
            changeSlide(currentCard);
            renderKnown();
            // updateSelected();
        }
    } else {
        if(hideBtn.checked) {
            let selectedCategory = groups[card.innerHTML];
            const involved = Object.keys(groups)
            let categoryName = involved[index];
            [involved[activeIndex], involved[index]] = [involved[index], involved[activeIndex]];
            let newGroups = {};
            for (let keys of involved) {
                newGroups[keys] = groups[keys];
            }
        
            groups = newGroups;
            const data = groups[involved[0]]
            const required = data.filter(((card) => card.Status !== "mastered"));
            renderAllCards(required);
        } else {
            let selectedCategory = groups[card.innerHTML];
            const involved = Object.keys(groups)
            let categoryName = involved[index];
            [involved[activeIndex], involved[index]] = [involved[index], involved[activeIndex]];
            let newGroups = {};
            for (let keys of involved) {
                newGroups[keys] = groups[keys];
            }
            groups = newGroups;
            renderGroups();
            console.log(Object.keys(groups)[0]);
            renderAllCards(groups[Object.keys(groups)[0]]);
        }
    }
}


function showCategory() {
    document.querySelector("#category-menu").classList.add("shown");
    
    document.querySelectorAll(".single-category").forEach((category) => {
        if(!category.classList.contains("content-control")) {
            category.classList.add("shown");
        }
        document.querySelector(".arrow").classList.add("shown");
    });
}

document.querySelector(".menu-content").addEventListener("click", function(e) {
    if(e.target.classList.contains("content-control")) {
        if(!document.querySelector(".menu-content").classList.contains("shown")) {
            showCategory()
        } else {
            closeCategory();
        }
    }
});

// document.querySelector("#category-menu").addEventListener("click", (e) => {
//     const clicked = e.target.closest(".single-category");
//     if(!clicked) return;
//     clicked.classList.toggle("shown");    
// });

function closeCategory() {
    document.querySelectorAll(".single-category").forEach((category) => {
        category.classList.remove("shown");
    })
    document.querySelector(".menu-content").classList.remove("shown");
    if(document.querySelector(".arrow")) document.querySelector(".arrow").classList.remove("shown");
}
if(document.querySelectorAll(".single-category").length  <= 1) {
    document.querySelector(".menu-content").innerHTML += `<h4 class="single-category" style="pointer-events: none;">No current category</h4>`
}

function checkTitle() {
    const title = document.querySelector(".category-title");
    if(cards.length > 0) {
        if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
            if(hideBtn.checked) {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const selected = allCards.filter((card) => card.Status !== "mastered");
                        title.textContent = selected[index].category;
                    }
                });

            } else {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        title.textContent = allCards[index].category;
                    }
                });
            }
        } else {
            if(hideBtn.checked) {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const data = document.querySelector(".content-control").textContent.slice(0, -1);
                        const category = groups[data];
                        const required = category.filter((card) => card.Status !== "mastered");
                        title.textContent = required[index].category;
                    }
                })
            } else {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const data = document.querySelector(".content-control").textContent.slice(0, -1);
                        const category = groups[data];
                        title.textContent = category[index].category;
                    }
                })
            }
        }
    } else {
        title.textContent = "";
    }
}

function updateWidth() {
    const container = document.querySelector(".menu");
    const subContainer = document.querySelector(".menu-content");
    const children = [...subContainer.children];
    
    if(document.querySelectorAll(".single-category").length > 1) {
        let maxWidth = 0;
        children.forEach((child) => {
            const width = child.offsetWidth;
            if(width > maxWidth) maxWidth = width;
        });
    
        container.style.width = `${maxWidth}px`;
    }
}

function renderKnown() {
    const label = document.querySelector(".known-label");
    if(cards.length > 0) {
        const progress = document.querySelector(".progress-content");
        const progressContainer = document.querySelector(".progress-bar");
        if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
            if(hideBtn.checked) {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const filtered = allCards.filter((c) => c.Status !== "mastered");
                        label.textContent = `${filtered[index].known}/5`;
                        progress.style.width = `${((filtered[index].known) / 5) * 100}%`;
                        label.classList.remove("master-label");
                        progressContainer.style.display = "flex";
                    }
                })
            } else {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        if(allCards[index].known === 5) {
                            label.innerHTML = `<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="20" height="20">
  <!-- Solid Green Background -->
  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
  <!-- White Inner Tick -->
  <polyline points="8 12 11 15 16 9" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Mastered ${allCards[index].known}/5`
                            label.classList.add("master-label");
                            progressContainer.style.display = "none";
                        } else {
                            label.textContent = `${allCards[index].known}/5`;
                            label.classList.remove("master-label");
                            progressContainer.style.display = "flex";
                            progress.style.width = `${((allCards[index].known) / 5) * 100}%`;
                        }
                    }
                })
            }
            
        } else {
            if(hideBtn.checked) {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const data = document.querySelector(".content-control").textContent.slice(0, -1);
                        const category = groups[data];
                        const filtered = category.filter((c) => c.Status !== "mastered");
                        label.classList.remove("master-label");
                        progressContainer.style.display = "flex";
                        label.textContent = `${filtered[index].known}/5`;
                        progress.style.width = `${((filtered[index].known) / 5) * 100}%`;
                    }
                })
            } else {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const data = document.querySelector(".content-control").textContent.slice(0, -1);
                        const category = groups[data];
                        if(category[index].known === 5) {
                            label.innerHTML = `<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="20" height="20">
  <!-- Solid Green Background -->
  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
  <!-- White Inner Tick -->
  <polyline points="8 12 11 15 16 9" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Mastered ${category[index].known}/5`;
                            label.classList.add("master-label");
                            progressContainer.style.display = "none";
                        } else {
                            label.textContent = `${(category[index].known)}/5`
                            progress.style.width = `${((category[index].known) / 5) * 100}%`;
                            label.classList.remove("master-label");
                            progressContainer.style.display = "flex";
                        }
                    }
                })
            }
        }
       
    } else {
        const progressContainer = document.querySelector(".progress-bar");
        label.textContent = "";
        progress.style.width = "0%";
        label.classList.remove("master-label");
        progressContainer.style.display = "none";
    }
}

renderKnown();

document.querySelector(".btn-flex").addEventListener("click", function(e) {
    previous = document.querySelector(".current").textContent;

    if(e.target.classList.contains("btn-section")) {
        const btn = e.target;
        document.querySelectorAll(".btn-section").forEach((btn) => {
            btn.classList.remove("current");
        })
        btn.classList.add("current");
    }
    renderMode();
    renderColors();
});

function renderMode() {
    const study = document.querySelector(".flash-card-container");
    const container = document.querySelector(".container");
    const show = document.querySelector(".all-container");
    const content = document.querySelector(".content");
    const option = document.querySelector(".flash-flex") 
    const controls = document.querySelector(".control-btns");
    if(previous === document.querySelector(".current").textContent) {
        return;
    } else {
        if(document.querySelector(".current").textContent === "All Cards") {
            study.classList.add("shown");
            container.classList.remove("shown");
            show.classList.add("shown");
            content.classList.add("shown");
            option.classList.add("shown");
            controls.classList.add("shown");
            if(hideBtn.checked) {
                updateCategory();
                renderGroups();
                renderKnown();
                const filtered = allCards.filter((card) => card.Status !== "mastered");
                renderAllCards(filtered);
                return;
            } else {
                updateCategory();
                renderGroups();
                renderKnown();
                renderAllCards(allCards);
            }
        } else {
            currentCard = 0;
            study.classList.remove("shown");
            container.classList.add("shown");
            show.classList.remove("shown");
            content.classList.remove("shown");
            option.classList.remove("shown");
            controls.classList.remove("shown");
            if(hideBtn.checked) {
                const filtered = allCards.filter((card) => card.Status !== "mastered");
                renderCards(filtered);
                checkLabel();
                updateCategory();
                renderGroups();
                renderKnown();
            } else {
                renderCards(allCards);
                checkLabel();
                updateCategory();
                renderGroups();
                renderKnown();
            }
        }
        checkLabel();
    }
}

renderMode();

function renderAllCards(items) {
   document.querySelector(".all-container").innerHTML =  items.map((card) => { 
    if(card.known === 5 && card.Status === "mastered") {
        return `
                    <div class="all-card">
                    
                    <div class="all-card-question">
                    <h4>Question:</h4>
                            <h3 class="all-question">${card.Question}</h3>
                        </div>
                            
                        <div class="all-card-answer">
                            <h4>Answer:</h4>
                            <h3 class="all-answer">${card.Answer}</h3>
                        </div>
                        <div class="option-flex">
                            <div class="border-category">
                                <p class="all-category">${card.category}</p>
                            </div>

                            <div class="master-label-container">
                                <button class="master-label"><svg xmlns="http://w3.org" viewBox="0 0 24 24" width="20" height="20">
  <!-- Solid Green Background -->
  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
  <!-- White Inner Tick -->
  <polyline points="8 12 11 15 16 9" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>  Mastered ${card.known}/5</button>
                            </div>
                            <div class="hover-container">
                                <p class="icon">&vellip;</p>
                            
                                <div class="function-flex">
                                <button class="inline-reset"><svg class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"
                                                d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                                        </svg></button>
    
                                        <button class="inline-delete">
                                        <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2"
                                                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>
                                        </button>
    
                                        <button class="inline-edit">
                                        <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2"
                                                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                                </svg>
                                                </button>
                                                </div>
                            </div>
                                            </div>
                    </div>
                    
                    `
    } else {
        
        return `
                    <div class="all-card">
                    
                    <div class="all-card-question">
                    <h4>Question:</h4>
                    <h3 class="all-question">${card.Question}</h3>
                        </div>
                            
                        <div class="all-card-answer">
                        <h4>Answer:</h4>
                            <h3 class="all-answer">${card.Answer}</h3>
                        </div>
   
                        <div class="option-flex">
                            <div class="border-category">
                                <p class="all-category">${card.category}</p>
                            </div>
                            <div class="inline-progress-flex">
                                <div class="inline-progress">
                                    <div class="inline-inner"></div>
                                </div>
                                <p class="all-label">${card.known}/5</p>
                            </div>

                            <div class="hover-container">
                                <p class="icon">&vellip;</p>
                            
                                <div class="function-flex">
                                <button class="inline-reset"><svg class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"
                                                d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                                        </svg></button>
    
                                        <button class="inline-delete">
                                        <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2"
                                                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>
                                        </button>
    
                                        <button class="inline-edit">
                                        <svg class="w-[16px] h-[16px] text-gray-800 dark:text-white"
                                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2"
                                                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                                </svg>
                                                </button>
                                                </div>
                            </div>
                        </div>

                    </div>
    `
    }
}).join("")

checkInner();
renderColors();  
if(document.querySelectorAll(".all-card").length < 1) {
        const container = document.querySelector(".all-container");
        container.style.height = "266px";
        container.style.backgroundColor = "#f9e4c8";
        container.style.border = "1.5px dashed grey";
        container.innerHTML = `
        <div style="line-height: 2;">
        <h2 style="text-align: center; font-family: serif; color: black;">No cards to view</h2>
        <h4 style="text-align: center; color: #626262; font-weight: 400; line-height: 1.5;">Adjust your filters or create a new card to get started</h4>
        </div>
        `
        container.style.alignItems = "center";
    } else {
        const container = document.querySelector(".all-container");
            container.style.height = "fit-content";
            container.style.border = "1px solid black";
            container.style.backgroundColor = "transparent";
    }
}
renderAllCards(allCards);

document.addEventListener("click", function(e) {
    const reset = e.target.closest(".inline-reset");
    if (!reset) return;
    const all = Array.from(document.querySelectorAll(".inline-reset"));
    const index = all.indexOf(reset);
    allCards[index].Status = "not-mastered";
    allCards[index].known = 0;
    localStorage.setItem("storedCards", JSON.stringify(allCards));
    renderCards(allCards);
    renderAllCards(allCards);
    renderColors();    
});

document.addEventListener("click", function(e){
    const cancel = e.target.closest(".inline-delete");
    if (!cancel) return;
    crossDelete = cancel;
    openDeleteModal();
});

document.addEventListener("click", function(e) {
    const edit = e.target.closest(".inline-edit");
    if (!edit) return;
    crossEdit = edit;
    openModal();
})

function checkInner() {
    document.querySelectorAll(".inline-inner").forEach((inner, index) => {
        const filtered = allCards.filter(card => card.Status !== "mastered");
        const width = filtered[index].known / 5 * 100;
        inner.style.width = `${width}%`
    })
}

checkInner();

function updateContent() {
    // 1. Corrected the selector with a dot (.)
    const container = document.querySelector(".flash-card.active .flash-card-content");
    if (!container) return;

    // Reset heights of all contents first
    document.querySelectorAll(".flash-card-content").forEach((c) => {
        c.style.height = "";
    });

    let maxHeight = 0;

    // 2. Measure the children (Question and Answer divs)
    Array.from(container.children).forEach(item => {
        // scrollHeight captures the full height of the text even if it overflows
        maxHeight = Math.max(maxHeight, item.scrollHeight);
    });

    // 3. Apply the height (add a bit of padding/buffer if needed)
    const finalHeight = maxHeight + 20; 
    container.style.height = finalHeight + 'px';
    
    // Also ensure the main wrapper expands
    const flashCardsWrapper = document.querySelector(".flash-cards");
    if(flashCardsWrapper) flashCardsWrapper.style.height = finalHeight + "px";
}

function renderColors() {
    allCards.map((card) => {if (!card.color) card.color = colors[Math.floor(Math.random() * colors.length)]});
    localStorage.setItem("storedCard", JSON.stringify(allCards));
    if(document.querySelector(".current").textContent === "Study Mode") {
        if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
            if(hideBtn.checked) {
                const filtered = allCards.filter((c) => c.Status !== "mastered");
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const color = filtered[index].color;
                        const followUp = colors.indexOf(color);
                        document.querySelector(".flash-cards").style.color = colorCover[followUp];
                        document.querySelector(".known-label").style.color = colorCover[followUp]
                        cardsContainer.style.backgroundColor = `${color}`;
                    }
                });
            } else {
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const color = allCards[index].color;
                        const followUp = colors.indexOf(color);
                        document.querySelector(".flash-cards").style.color = colorCover[followUp];
                        document.querySelector(".known-label").style.color = colorCover[followUp]
                        cardsContainer.style.backgroundColor = `${color}`;
                    }
                });
            }
        } else {
            if(hideBtn.checked) {
                const data = document.querySelector(".content-control").textContent.slice(0, -1);
                const category = groups[data];
                const filtered = category.filter((c) => c.Status !== "mastered");
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const color = filtered[index].color;
                        const followUp = colors.indexOf(color);
                        document.querySelector(".flash-cards").style.color = colorCover[followUp];
                        document.querySelector(".known-label").style.color = colorCover[followUp]
                        cardsContainer.style.backgroundColor = `${color}`;
                    }
                })
            } else {
                const data = document.querySelector(".content-control").textContent.slice(0, -1);
                const category = groups[data];
                cards.forEach((card, index) => {
                    if(card.classList.contains("active")) {
                        const color = category[index].color;
                        const followUp = colors.indexOf(color);
                        document.querySelector(".flash-cards").style.color = colorCover[followUp];
                        document.querySelector(".known-label").style.color = colorCover[followUp]
                        cardsContainer.style.backgroundColor = `${color}`;
                    }
                })
            }
        }
    } else {
        if(document.querySelector(".content-control").textContent.slice(0, -1) === "All category") {
            if(hideBtn.checked) {
                const filtered = allCards.filter((c) => c.Status !== "mastered");
                document.querySelectorAll(".all-card").forEach((card, index) => {
                    const color = filtered[index].color
                    const followUp = colors.indexOf(color);
                    card.style.backgroundColor = color;
                    card.style.color = colorCover[followUp];
                })
            } else {
                document.querySelectorAll(".all-card").forEach((card, index) => {
                    const color = allCards[index].color;
                    const followUp = colors.indexOf(color);
                    card.style.backgroundColor = color;
                    card.style.color = colorCover[followUp];
                })
            }
        } else {
            if(hideBtn.checked) {
                const data = document.querySelector(".content-control").textContent.slice(0, -1);
                const category = groups[data];
                const filtered = category.filter((c) => c.Status !== "mastered");
                document.querySelectorAll(".all-card").forEach((card, index) => {
                    const color = filtered[index].color;
                    const followUp = colors.indexOf(color);
                    card.style.backgroundColor = color;
                    card.style.color = colorCover[followUp];
                })
            } else {
                const data = document.querySelector(".content-control").textContent.slice(0, -1);
                console.log(data);
                const category = groups[data];
                document.querySelectorAll(".all-card").forEach((card, index) => {
                    const color = category[index].color
                    const followUp = colors.indexOf(color);
                    card.style.backgroundColor = color;
                    card.style.color = colorCover[followUp];
                })
            }
        }
    }
}
renderColors();

document.addEventListener("click", function(e) {
    if(!e.target.classList.contains("content-control")) {
        closeCategory();
    }
});

document.addEventListener("click", function(e) {
        const icon = e.target.closest(".icon");
        if(icon) {
            const item = document.querySelectorAll(".function-flex");
            const list = Array.from(document.querySelectorAll(".icon"));
            const index = list.indexOf(icon);
            item[index].classList.toggle("shown");
        } else {
            document.querySelectorAll(".function-flex").forEach(item => item.classList.remove("shown"));
        }
})