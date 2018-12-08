// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page

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

    figureLink.append("<img src='"+data[i].image +"'>");

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
    var newFormTime = new Date(formTime);

    // var entryMonth = $("<span class='entry-month'>").html(newFormTime);
    // entryDate.append(entryMonth);
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
    
    var saveArticle = $("<a class='dotted-link1 addArticle'>");
    pullRight.append(saveArticle);

    var saveArticleSpan = $("<span>").html("Save this story ");
    saveArticle.append(saveArticleSpan);

    var saveArticlePlus = $("<i class='fa fa-plus'>");
    saveArticleSpan.append(saveArticlePlus);

    var commentNote = $("<a class='btn addComment'><i class='fas fa-comment fa-3x'>");
    entryFooter.append(commentNote);





    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
