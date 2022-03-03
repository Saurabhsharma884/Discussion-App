// listen for submit button to create question
// save question to the storage
// append question to the left panel
// listen for click on question and display in right pane
// listen for click on submit respone Button
// display response in response section
var questionSubmitBtn = document.getElementById("submitBtn");
var questionTitle = document.getElementById("title");
var questionDesc = document.getElementById("questionDesc");
var questionList = document.getElementById("questionList")

questionSubmitBtn.addEventListener("click", submitQuestion);

//make question
function makeQuestion() {
  var question = {
    title: questionTitle.value,
    description: questionDesc.value,
    responses: [],
  };
  return question;
}

function makeQuestionUI(question) {

    var quesBlock = document.createElement('div');
    quesBlock.setAttribute('id','quesBlock')

    var quesTitle = document.createElement('div')
    quesTitle.innerHTML = question.title;

}

//submit question
function submitQuestion() {
  var question = makeQuestion();

  saveQuestionToStorage(question);
  addQuestionToUI(question);
}

//add question to list on right 
function addQuestionToUI(question){
    questionList.prepend(makeQuestionUI(question))

}

//save the question to local storage
function saveQuestionToStorage(question) {
  var questions = getAllQuestion();
  questions.push(question)
  localStorage.setItem('questions',JSON.stringify(questions))
}

//return all questions in the storage
function getAllQuestion() {
  var questions = localStorage.getItem("questions");
  if (question) questions = JSON.parse(questions);
  else questions = [];
  return questions;
}
