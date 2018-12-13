
// get the article information as a json
$.getJSON("/articles", function (data) {

  for (var i = 0; i < data.length; i++) {

    // display the article information on the page

    var holder = $("<article>");

    holder.addClass("entry");

    $("main").append(holder);

    //-------

    var figure = $("<figure>");

    figure.addClass("entry-thumbnail");

    holder.append(figure);

    //-------

    var figureLink = $("<a href='#'>");

    figure.append(figureLink);

    //-------

    figureLink.append("<img src='" + data[i].image + "'>");

    //-------

    var entryBody = $("<div class='entry-body'>");

    holder.append(entryBody);

    //-------

    var entryDate = $("<div class='entry-date'>");

    entryBody.append(entryDate);

    //-------

    var entryDay = $("<span class='entry-day'>");
    entryDate.append(entryDay);

    //-------
    // format time variable
    var formTime = data[i].time;
    var newFormMonth = moment(formTime).format("MMM");
    var newFormDay = moment(formTime).format("DD");
    // var newFormTime = new Date(formTime);
    // var newFormMonth = newFormTime.getMonth();
    // var newFormDay = newFormTime.getDay();

    entryDay.append(newFormDay);

    var entryMonth = $("<span class='entry-month'>").html(newFormMonth);
    entryDate.append(entryMonth);
    // console.log(data[i].time);
    //-------

    var entryHeader = $("<header class='entry-header'>");
    holder.append(entryHeader);

    //-------

    var titleBordered = $("<div class='title-bordered'>");
    entryHeader.append(titleBordered);

    //-------

    var dataHeader = $("<h4 data-id='" + data[i]._id + "'>");
    titleBordered.append(dataHeader);

    //-------

    var dataHeaderLink = $("<a href='" + data[i].link + "'>");
    dataHeader.append(dataHeaderLink);

    //-------

    var dataTitle = data[i].title;
    dataHeaderLink.append(dataTitle);

    //-------

    var entryExcerpt = $("<div class='entry-excerpt'>");
    holder.append(entryExcerpt);

    var entryExcerptPara = $("<p>").html(data[i].excerpt);
    entryExcerpt.append(entryExcerptPara);

    //-------

    var entryFooter = $("<footer class='entry-footer'>");
    holder.append(entryFooter);

    var pullLeft = $("<div class='pull-left'>").text("Posted By ");
    entryFooter.append(pullLeft);

    var postedBy = $("<a class='dotted-link1'>").html("Brian");
    pullLeft.append(postedBy);

    var pullRight = $("<div class='pull-right'>");
    entryFooter.append(pullRight);

    // var saveArticle = $("<a class='dotted-link1 addArticle'>");
    // pullRight.append(saveArticle);

    // var saveArticleSpan = $("<span>").html("Save this story ");
    // saveArticle.append(saveArticleSpan);

    // var saveArticlePlus = $("<i class='fa fa-plus'>");
    // saveArticleSpan.append(saveArticlePlus);

    // var commentNote = $("<a class='btn addComment'><i class='fas fa-comment fa-3x'>");
    // entryFooter.append(commentNote);

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
  // event handler for deleting a note
  $(".delete-btn").click(function (event) {
    event.preventDefault();
    const id = $(this).attr("data");
    $.ajax(`/remove/${id}`, {
      type: "PUT"
    }).then(function () {
      location.reload();
    })
  });

  // event handler for opening the note modal
  $(document).on("click", ".addComment", function (event) {
    console.log("clicked comment icon");
    event.preventDefault();
    // const id = $(this).attr("data");
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

      // console.log(data[0].note.length);
      console.log(data);

      


      // $(".articles-available").empty();
      $("#notes").empty();
      $("#footer-notes").empty();

      $("#notes").append("<h2>" + data[0].title + "</h2>");

      $("#notes").append("<label for='comment-title'>Comment Title</label>");
      $("#notes").append("<input type='text' class='form-control' id='titleinput' name='title'><br />");

      $("#notes").append("<label for='comment'>Your Comment</label>");
      $("#notes").append("<textarea class='form-control' id='bodyinput' name='body'></textarea>");

      $("#footer-notes").append("<button class='btn btn-primary' data-id='" + data[0]._id + "' id='savenote'>Add Comment</button>");


      if (data[0].note.length > 0) {
        data[0].note.forEach(v => {
          // $('.articles-available').append($(`<li class='list-group-item'>${v.text}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='${v._id}'>X</button></li>`));
          $("#comments").append($(`<li class='list-group-item'>${v.title}<li class='list-group-item'>${v.body}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='${v._id}'><i class="fas fa-trash-alt fa-3x"></i></button></li>`));
        })
      }
      else {
        // $('.articles-available').append($(`<li class='list-group-item'>No notes for this article yet</li>`));
        $("#notes").append($(`<li class='list-group-item'>Be the first to comment on this article!</li>`));
        console.log("Second ran!")
      }
    })
    $('#articleModal').modal();
  });

  // $('.btn-deletenote').click(function (event) {
  $(document).on('click', '.btn-deletenote', function () {
    //event.preventDefault();
    console.log($(this).attr("data"))
    const id = $(this).attr("data");
    console.log(id);
    $.ajax(`/note/${id}`, {
      type: "DELETE"
    }).then(function (event) {
      // $('#note-modal').modal('toggle');
      location.reload();
      console.log("deleted comment....???");
    });
  });

  $(document).on("click", "#savenote", function (event) {
    console.log("clicked add comment");
    //event.preventDefault();
    const id = $(event.target).attr('data-id');
    console.log(id);
    var ti = $("#titleinput").val();
    var bi = $("#bodyinput").val();
    console.log(ti);
    console.log(bi);
    // const noteText = $('#bodyinput').val().trim();
    // $('#bodyinput').val('');


    $.ajax(`/note/${id}`, {
      type: "POST",
      data: { title: ti, body: bi }
      
    })
    
    // $.ajax({
    //   method: "POST",
    //   url: "/articles/" + id,

    //   data: {
    //     // Value taken from title input
    //     // title: $("#titleinput").val(),
    //     title: $("#comment-title").append(ti),
    //     // Value taken from note textarea
    //     // body: $("#bodyinput").val()
    //     body: $("#comment-body").append(bi)
    //   }
    // })
    .then(function (data) {
      console.log(data)
    })
    $('#articleModal').modal("hide");
  });

  $(".save-btn").click(function (event) {
    event.preventDefault();
    const button = $(this);
    const id = button.attr("id");
    $.ajax(`/save/${id}`, {
      type: "PUT"
    }).then(function () {
      const alert = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
            Your note has been saved!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>`
      button.parent().append(alert);
    }
    );
  });
});