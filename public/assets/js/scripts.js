// $('#saveModal').modal(); // Articles Saved Modal
// $('#modalMessage').modal(); // Message Modal
// $('#articleModal').modal(); // Notes Modal





window.onload = function(){
  $('#articleModal').modal(); // Notes Modal
  let modalID = $(this).attr("id");

  let sessionArticle = JSON.parse(sessionStorage.getItem(modalID));
  $('#articleModal').modal("open");
  let title = $(this).children(".title").text();
  $('#articleID').text(title);


$(".addComment").on("click", function () { // Event Listener for Adding Comments

  console.log("clicked");
  let note = $('#textarea1').val();

  let noteObject = {
    body: {
      body: note
    },
    articleID: {
      articleID: modalID
    }
  }
})

}