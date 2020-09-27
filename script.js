// Selectors for index.html
let startButtunEl = document.getElementById('startQuizBtn');
let questionsContainer = document.getElementById('questions-container');
let countdowunEl = document.getElementById('countdown');
let timeLeft = document.getElementById('time-left');
let finalScore = document.getElementById('final-score');
let addPersonBtn = document.getElementById('add-person');
let buttonContainerEl = document.getElementById('button-container');
let answersCorrectEl = document.getElementById('answers-correct')
let finalResultsEl = document.getElementById('final-results');



// Setting up main vars to be used throughout the game
let timer = 40;
let counter = 0;
let score = 0;
let endTimer;
let answersCorrect = 0;
// Adding a check to prevent an error on high-scores page
if(questionsContainer !== null) {
    // Sets a var to number of the index of the last question asked.
    endTimer = questionsContainer.children.length - 1;
}



// functions to hide or show an element             
const hideElement = elementToHide => { if(elementToHide !== undefined) {elementToHide.style.display = 'none'} }
const showElement = (elementToShow, displayStyle) => { 
    // conditional checks to prevent errors on undefined elements/styles
    if (elementToShow !== undefined & displayStyle === undefined) { 
        elementToShow.style.display = 'block';
    }
    if (displayStyle !== undefined) {
        elementToShow.style.display = displayStyle;
    }
}





// ---------------------Main function that Starts the flow of the game. -----------------------------------------------
const startGame = () => {

    // Gets all the list items and removes any background styles apllied with the classes correct or wrong.
    let allListItemEl = document.querySelectorAll('li');
    allListItemEl.forEach(elment => elment.classList.remove('correct', 'wrong'))
 
    // Hides last element left in the questionsContainer to clear it for a new run
    hideElement(questionsContainer.children[counter]);

    // Resets vars back to defualt values
    timer = 40;
    counter = 0;
    answersCorrect = 0;
    score = 0;

    // Handles main flow of the game below 
    // hide start button, start countdown, and start showing first question along with countdown
    hideElement(finalResultsEl);
    hideElement(buttonContainerEl); 
    startCountdown();
    showElement(questionsContainer.children[counter]);
    showElement(timeLeft);

    // Sets input value back to an empty string for a new run if played before.
    document.getElementById('initials').value = '';
}





// Function to handle the countdown timer
const startCountdown = () => {
    
    // Setting interval up to handle logic every 1 second
    let gameTimer = setInterval(() => {

        // if timer === 0 or last question is completed. Handles end of the game logic.
        if (timer === 0 || counter === endTimer) {
            // clears gameTimer, shows button, hides time left and updates the score
            clearInterval(gameTimer);
            showElement(buttonContainerEl);
            hideElement(timeLeft);
            if (counter < endTimer) {
                hideElement(questionsContainer.children[counter]);
                counter = endTimer;
            }
            answersCorrectEl.textContent = answersCorrect
            showElement(questionsContainer.children[counter]);
            showElement(finalResultsEl)
            finalScore.textContent = score;
            // return countdowunEl.textContent = timer;
        }
        else {
            // If game is not over decrement 1 from timer
            timer --   
        }
        countdowunEl.textContent = timer;

    }, 1000);
    // Updates timer right away with first value so it doesn't take 1 second to initalize
    return countdowunEl.textContent = timer;
}





// function to handle click events on list items of the Questions being asked
const checkAnswer = event => {

    // Getting target of the click event.
    let listItemEl = event.target

    // Getting value of the data-answer attribute
    let answerData = listItemEl.getAttribute('data-answer')
    
    // If anwer is wrong take some time away and turn background red.
    if (answerData === 'wrong') {
        listItemEl.classList.add('wrong');
        timer = timer-2;
    } else {
        // anwer is correct add 1 to answersCorrect and turn background green.
        listItemEl.classList.add('correct');
        answersCorrect++
    }
    // Waits 100 ms so the user can see if their anwer is correct or wrong.
    let changeColor = setTimeout(() => {
        // Hides current question, increments counter and shows the next question
        hideElement(questionsContainer.children[counter])
        counter++;
        showElement(questionsContainer.children[counter])
        clearTimeout(changeColor)
            // If counter is equal to the last question update score 
        if (counter === endTimer) {
            score = timer
        }
    },100)
};





// Function to Handle adding a users score to local stoarage to used in high-scores page
const addScore = () => {
    
    // Stores value of input into a var 
    let user =  document.getElementById('initials').value;

    if (user === '') {
        alert('Please fill enter your name or initials.')
    } else {
        // If listOfScores Obj isn't created yet make one.
        if (localStorage.getItem('listOfScores') === null){
            localStorage.setItem('listOfScores', '{}');
        }
        
        // Creates a var for the old Obj and parse it to make it usable(not a string)
        let old_listOfScores = JSON.parse(localStorage.getItem('listOfScores'));
     
        // checking if the user already has a value and if they do do they want to override their score 
        let checkIfUserExists = true;
        if ( old_listOfScores.hasOwnProperty(user) ) {
            checkIfUserExists = confirm('This user already has a score of: '+ old_listOfScores[user] + ' do you want to overide it?');
        }

        // Sets a new key with user and the score as a value.
        if (checkIfUserExists) {old_listOfScores[user] = score;}
    
        // Once the loacal storage Obj is updated convert back to a string to be used agian later.
        localStorage.setItem('listOfScores', JSON.stringify(old_listOfScores))
        // Hides Element that contains input and add user btn.
        hideElement(questionsContainer.children[counter]);
    }

}





// Function to handle Adding all users and their scores to the high-scores page.
const appendHidhScores = () => {

    // Selects the Element to add the scores to
    let listOfScoresEl = document.getElementById('list-of-scores');

    // Checks if listOf Scores is created yet if true...
    if (localStorage.getItem('listOfScores') !== null) {
        
        // Creates a var to store list of Scores Obj then, convert to an array 
        // and sort them out with highest on top
        let listToSort = JSON.parse(localStorage.getItem('listOfScores'));
        listToSort = Object.entries(listToSort);
        let sortedList = listToSort.sort((a,b) => b[1] - a[1])

        // Once we have a sorted list of users and their scores append them to the dom
        // using a for loop 
        for (let i = 0; i < sortedList.length; i++) {
            // logic to handle creating an element
           let pEl =  document.createElement('p');
           // updating the text content of the p to access the values of the sub array created from sorting.
           // Could have been an ol “¯\_(ツ)_/¯“
           pEl.textContent = `${i + 1}. ${sortedList[i][0]}: ${sortedList[i][1]}`;
           pEl.classList.add('ml-1')
           listOfScoresEl.appendChild(pEl);

        }

    }
    
    if (listOfScoresEl.children.length === 0){
        hideElement(listOfScoresEl);
    }

}





// -------------------------- EVENT Listeners -------------------------------------------------
// added checks to prevent errors on pages without specified elements created on them 

if (document.getElementById('list-of-scores') !== null) {
    appendHidhScores()
    
}

if (startButtunEl!== null) {
    startButtunEl.addEventListener('click',startGame)
}

if (addPersonBtn !== null) {
    addPersonBtn.addEventListener('click', addScore);
}


document.querySelectorAll('.question').forEach( item => { 
    item.addEventListener('click', checkAnswer)
})




