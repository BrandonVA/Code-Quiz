var startButtunEl = document.getElementById('startQuizBtn');
var questionsContainer = document.getElementById('questions-container');
var countdowunEl = document.getElementById('countdown');
var timeLeft = document.getElementById('time-left');
var finalScore = document.getElementById('final-score');
var addPersonBtn = document.getElementById('add-person');





// functions to hide or show an element             
// you could also use style.display === 'none' to hide 
// and display === '(inline) or whatever defualt style that the element is

const hideElement = elementToHide => { if(elementToHide!== undefined) {elementToHide.style.display = 'none'} }
const showElement = (elementToShow, displayStyle) => { 
    if (elementToShow !== undefined & displayStyle === undefined) { 
        elementToShow.style.display = 'block';
    }
    if (displayStyle !== undefined) {
        elementToShow.style.display = displayStyle;
    }
}






var timer = 20;
let counter = 0;
var score = 0;
let endTimer;
if(questionsContainer !== null) {
    endTimer = questionsContainer.children.length - 1;
}


const startGame = () => {
    hideElement(questionsContainer.children[counter]);
    timer = 20;
    counter = 0;
    hideElement(startButtunEl); 
    startCountdown();
    showElement(questionsContainer.children[counter]);
    showElement(timeLeft);
    document.getElementById('initials').value = '';
}


const startCountdown = () => {
    
    var gameTimer = setInterval(() => {

        
        if (timer === 0 || counter === endTimer) {
            clearInterval(gameTimer);
            showElement(startButtunEl, 'inline');
            hideElement(timeLeft);
            finalScore.textContent = score;
            return countdowunEl.textContent = timer;
        }
        else {
            timer --
            
        }
        countdowunEl.textContent = timer;

        
    }, 1000);
    return countdowunEl.textContent = timer;
}

const logThisElement = event => {

    let listItemEl = event.target
    console.log(listItemEl);
    let answerData = listItemEl.getAttribute('data-answer')
    console.log(answerData);

    // if ( listItemEl.getAttribute('data-answer')  === 'correct') {
    //     //alert('correct answer');
    // }
    if (listItemEl.getAttribute('data-answer') === 'wrong') {
        timer = timer-2;
    }
    hideElement(questionsContainer.children[counter])
    counter++;
    showElement(questionsContainer.children[counter])

    if (counter === endTimer) {
       score = timer
        console.log(score);
    }

};


const addScore = () => {
    
    var user =  document.getElementById('initials').value;

    if (localStorage.getItem('listOfScores') === null){

     localStorage.setItem('listOfScores', '{}');
     
    }
    
    var old_listOfScores = JSON.parse(localStorage.getItem('listOfScores'));
    old_listOfScores[user] = score;

    localStorage.setItem('listOfScores', JSON.stringify(old_listOfScores))
    hideElement(questionsContainer.children[counter]);
}






const appendHidhScores = () => {
    console.log('Button Clicked');
    if (localStorage.getItem('listOfScores') !== null) {
        console.log("passed condition");
        var listOfScoresEl = document.getElementById('list-of-scores')
        
       var listToSort = JSON.parse(localStorage.getItem('listOfScores'));
       listToSort = Object.entries(listToSort);
       var sortedList = listToSort.sort((a,b) => b[1] - a[1])

        console.log(sortedList.length);
        for (var i = 0; i < sortedList.length; i++) {
           var pEl =  document.createElement('p');
           pEl.textContent = `${sortedList[i][0]}: ${sortedList[i][1]}`;
           listOfScoresEl.appendChild(pEl);

        }
    }

}




var showScoresBtn = document.getElementById('show-scores');

if (showScoresBtn !== null) {
    appendHidhScores()
    
}

if (startButtunEl!== null) {
    startButtunEl.addEventListener('click',startGame)
}

if (addPersonBtn !== null) {
    addPersonBtn.addEventListener('click', addScore);
}


document.querySelectorAll('.question').forEach( item => { 
    item.addEventListener('click',logThisElement)
})