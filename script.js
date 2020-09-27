// Selectors for index.html
var startButtunEl = document.getElementById('startQuizBtn');
var questionsContainer = document.getElementById('questions-container');
var countdowunEl = document.getElementById('countdown');
var timeLeft = document.getElementById('time-left');
var finalScore = document.getElementById('final-score');
var addPersonBtn = document.getElementById('add-person');
let buttonContainerEl = document.getElementById('button-container');

// Selectors for high-scores.html
var showScoresBtn = document.getElementById('show-scores');

// Setting up main vars to be used throughout the game
var timer = 20;
let counter = 0;
var score = 0;
let endTimer;
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

    // Hides last element left in the questionsContainer to clear it for a new run
    hideElement(questionsContainer.children[counter]);

    // Resets vars back to defualt values
    timer = 20;
    counter = 0;

    // Handles main flow of the game below 
    // hide start button, start countdown, and start showing first question along with countdown
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
    var gameTimer = setInterval(() => {

        // if timer === 0 or last question is completed. Handles end of the game logic.
        if (timer === 0 || counter === endTimer) {
            // clears gameTimer, shows button, hides time left and updates the score
            clearInterval(gameTimer);
            showElement(buttonContainerEl);
            hideElement(timeLeft);
            if (counter < endTimer) {
                hideElement(questionsContainer.children[counter]);
                counter = endTimer

            }
            
            showElement(questionsContainer.children[counter]);

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
    console.log(listItemEl);
    // Getting value of the data-answer attribute
    let answerData = listItemEl.getAttribute('data-answer')
    console.log(answerData);

    // If anwer is wrong take some time away.
    if (listItemEl.getAttribute('data-answer') === 'wrong') {
        timer = timer-2;
    }
    // Hides current question, increments counter and shows the next question
    hideElement(questionsContainer.children[counter])
    counter++;
    showElement(questionsContainer.children[counter])

    // If counter is equal to the last question update score 
    if (counter === endTimer) {
       score = timer
        console.log(score);
    }

};





// Function to Handle adding a users score to local stoarage to used in high-scores page
const addScore = () => {
    
    // Stores value of input into a var 
    var user =  document.getElementById('initials').value;

    if (user === '') {
        alert('Please fill enter your name or initials.')
    } else {

        // If listOfScores Obj isn't created yet make one.
        if (localStorage.getItem('listOfScores') === null){
            localStorage.setItem('listOfScores', '{}');
        }
        
        // Creates a var for the old Obj and parse it to make it usable(not a string)
        var old_listOfScores = JSON.parse(localStorage.getItem('listOfScores'));
     
        // checking if the user already has a value and if they do do they want to override their score 
        var checkIfUserExists = true;
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

    // Checks if listOf Scores is created yet if true...
    if (localStorage.getItem('listOfScores') !== null) {
        
        console.log("passed condition");

        // Selects the Element to add the scores to
        var listOfScoresEl = document.getElementById('list-of-scores');
        // Creates a var to store list of Scores then, convert to an array 
        // and sort them out with highest on top
        var listToSort = JSON.parse(localStorage.getItem('listOfScores'));
        listToSort = Object.entries(listToSort);
        var sortedList = listToSort.sort((a,b) => b[1] - a[1])

        console.log(sortedList.length);

        // Once we have a sorted list of users and their scores append them to the dom
        // using a for loop 
        for (var i = 0; i < sortedList.length; i++) {
            // logic to handle creating an element
           var pEl =  document.createElement('p');
           // updating the text content of the p to access the values of the sub array created from sorting.
           // Could have been an ol “¯\_(ツ)_/¯“
           pEl.textContent = `${i + 1}. ${sortedList[i][0]}: ${sortedList[i][1]}`;
           listOfScoresEl.appendChild(pEl);

        }
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




