// listen for submit button to create question
// save question to the storage
// append question to the left panel
// listen for click on question and display in right pane
// listen for click on submit respone Button
// display response in response section
var questionSubmitBtn = document.getElementById("submitBtn");
var questionTitle = document.getElementById("title");
var questionDesc = document.getElementById("questionDesc");

questionSubmitBtn.addEventListener("click", submitQuestion);
function makeQuestion() {
  var question = {
    title: questionTitle.value,
    description: questionDesc.value,
    responses: [],
  };
}
function submitQuestion() {}

function onQuestionSubmit() {}
