
function loadCreatePost() {
    $('#pageContent').html(`
    <div class="container px-4 px-lg-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h2 class="text-center mt-5 mb-4">Create Post</h2>
                <div class="alert alert-danger d-none" id="error"></div>
                <div class="alert alert-success d-none" id="success"></div>
                <div class="form-group mb-3">
                    <label for="title">Title</label>
                    <input required type="text" class="form-control" name="title" id="title" placeholder="Enter title">
                </div>
                <div class="form-group mb-3">
                    <label for="content">Content</label>
                    <textarea required class="form-control" name="content" id="content" rows="5" placeholder="Enter content"></textarea>
                </div>
                <label for="content">Categories: </label>
                <div class="form-group mb-3" id="categories-container">
                    <!-- Categories will be loaded here -->
                </div>
                <button id='create-btn' type="button" onclick="creatPost()" class="btn btn-primary btn-block">Create Post</button>
            </div>
        </div>
    </div>
    <br>
    <script>
        $(document).ready(function() {
            fetchCategories();
            $("input").on("keypress", function () {
                $("#error").hide();
                $("#success").hide();
                $("#error").addClass("d-none");
                $("#success").addClass("d-none");
            });
        });
    </script>
    `);
    fetchCategories();
}


function fetchCategories() {
    $.ajax({
        url: "/getCategories",
        type: "post",
        success: function(categories) {
            var container = $("#categories-container");
            container.empty();  // Clear existing content
            categories.forEach(function(category) {
                var categoryHtml = `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="categories" value="${category.Name}" id="flexCheck${category.ID}">
                        <label class="form-check-label" for="flexCheck${category.ID}">
                            ${category.Name}
                        </label>
                    </div>
                `;
                container.append(categoryHtml);
            });
        },
        error: function(error) {
            console.error("Error fetching categories:", error);
        }
    });
}

function creatPost() {
    const createBtn = document.getElementById('create-btn');
    createBtn.disabled = true;

    const title = $("#title").val();
    const content = $("#content").val();
    const categories = [];
    $.each($("input[name='categories']:checked"), function () {
        categories.push($(this).val());
    });

    if (title.trim() === "" || content.trim() === "") {
        $("#error").html("Title and Content are required");
        $("#error").show();
        $("#error").removeClass("d-none");
        createBtn.disabled = false;
        $("#error").fadeOut(3000);
        return;
    }

    if (categories.length === 0) {
        $("#error").html("Categories are required");
        $("#error").show();
        $("#error").removeClass("d-none");
        createBtn.disabled = false;
        $("#error").fadeOut(3000);
        return;
    }

    const data = JSON.stringify({
        Title: title,
        Content: content,
        Categories: categories
    });
    $.ajax({
        url: "/createPostAction",
        type: "POST",
        contentType: "application/json",
        data: data,
        success: function (response) {
            $("#success").html("Post Created Successfully");
            $("#success").show();
            $("#success").removeClass("d-none");

            setTimeout(() => {
                location.href = 'post?id=' + response
            }, 3000);
        },
        error: function (error) {
            $("#error").html(error.responseText);
            $("#error").show();
            $("#error").removeClass("d-none");
            createBtn.disabled = false;
        }
    });
}

