
// get the article information as a json
$.getJSON("/articles", function (data) {

  for (var i = 0; i < data.length; i++) {

    // display the article information on the page

    var holder = $("<article>");
    holder.addClass("entry");
    $("main").append(holder);

    var figure = $("<figure>");
    figure.addClass("entry-thumbnail");
    holder.append(figure);

    var figureLink = $("<a href='#'>");
    figure.append(figureLink);
    figureLink.append("<img src='" + data[i].image + "'>");

    var entryBody = $("<div class='entry-body'>");
    holder.append(entryBody);

    var entryDate = $("<div class='entry-date'>");
    entryBody.append(entryDate);
    var entryDay = $("<span class='entry-day'>");
    entryDate.append(entryDay);

    // format time variable
    var formTime = data[i].time;
    var newFormMonth = moment(formTime).format("MMM");
    var newFormDay = moment(formTime).format("DD");

    entryDay.append(newFormDay);
    var entryMonth = $("<span class='entry-month'>").html(newFormMonth);
    entryDate.append(entryMonth);

    var entryHeader = $("<header class='entry-header'>");
    holder.append(entryHeader);
    var titleBordered = $("<div class='title-bordered'>");
    entryHeader.append(titleBordered);
    var dataHeader = $("<h4 data-id='" + data[i]._id + "'>");
    titleBordered.append(dataHeader);
    var dataHeaderLink = $("<a href='" + data[i].link + "'>");
    dataHeader.append(dataHeaderLink);
    var dataTitle = data[i].title;
    dataHeaderLink.append(dataTitle);
    var entryExcerpt = $("<div class='entry-excerpt'>");
    holder.append(entryExcerpt);
    var entryExcerptPara = $("<p>").html(data[i].excerpt);
    entryExcerpt.append(entryExcerptPara);
    var entryFooter = $("<footer class='entry-footer'>");
    holder.append(entryFooter);
    var pullLeft = $("<div class='pull-left'>").text("Posted By ");
    entryFooter.append(pullLeft);
    var postedBy = $("<a class='dotted-link1'>").html("Brian");
    pullLeft.append(postedBy);
    var pullRight = $("<div class='pull-right'>");
    entryFooter.append(pullRight);
    var commentNote = $("<a class='btn addComment'><i class='fas fa-comment fa-3x'>");
    pullRight.append(commentNote);
    var commentSection = $("<div id='comments'>");
    holder.append(commentSection);
    var commentTitle = $("<div id='comment-title'>");
    commentSection.append(commentTitle);
    var commentBody = $("<div id='comment-body'>");
    commentSection.append(commentBody);
  }
});

$(document).ready(function () {

  // event handler for opening the note modal
  $(document).on("click", ".addComment", function (event) {

    event.preventDefault();

    const id = $(event.target).parentsUntil("h4")[3].children[2].children[0].children[0].getAttribute("data-id");
    console.log(id);
    
    // $('#article-id').text(id);
    // $('#save-note').attr('data', id);

    var ti = $("#titleinput");
    var bi = $("#bodyinput"); 

    $.ajax({
      method: "GET",
      url: "/articles/" + id
    })
    .then(function (data) {

      $("#notes").empty();
      $("#footer-notes").empty();

      $("#notes").append("<h2>" + data[0].title + "</h2>");

      $("#notes").append("<label for='comment-title'>Comment Title</label>");
      $("#notes").append("<input type='text' class='form-control' id='titleinput' name='title'><br />");

      $("#notes").append("<label for='comment'>Your Comment</label>");
      $("#notes").append("<textarea class='form-control' id='bodyinput' name='body'></textarea>");

      $("#footer-notes").append("<button class='btn btn-primary' data-id='" + data[0]._id + "' id='savenote'>Add Comment</button>");

      if (data[0].note.length > 0) {
        data[0].note.forEach(b => {
          $("#comments").append($(`<li class='list-group-item'>${b.title}<li class='list-group-item'>${b.body}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='${b._id}'><i class="fas fa-trash-alt fa-3x"></i></button></li>`));
        })
      }
      else {
        $("#notes").append($(`<li class='list-group-item'>Be the first to comment on this article!</li>`));
      }
    })
    $('#articleModal').modal();
  });

  $(document).on('click', '.btn-deletenote', function () {
    const id = $(this).attr("data");
    $.ajax(`/note/${id}`, {
      type: "DELETE"
    }).then(function (event) {
      location.reload();
      console.log("deleted comment....???");
    });
  });

  $(document).on("click", "#savenote", function (event) {
    console.log("clicked add comment");
    //event.preventDefault();
    const id = $(event.target).attr('data-id');

    var ti = $("#titleinput").val();
    var bi = $("#bodyinput").val();

    $.ajax(`/note/${id}`, {
      type: "POST",
      data: { title: ti, body: bi }
      
    })
    .then(function (data) {
      console.log(data)
    })
    $('#articleModal').modal("hide");
    location.reload();
  });
});