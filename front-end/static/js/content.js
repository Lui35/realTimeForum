
// $("#home").click(function() {
// switchContent("home");
// });


$(document).ready(function () {
    // Ensure the switchContent function is called correctly
    switchContent("home");

    $.ajax({
        url: "/authenticateCookieWithJS",
        type: "POST",
        success: function (userID) {
            // User is logged in, show the buttons
            $("#chatPage").closest("li").show();
            $("#filterCreatedPost").closest("li").show();
            $("#filterLikedPost").closest("li").show();
            $("#createPost").closest("li").show();
            $("#logout").closest("li").show();
            //
            $("#login").closest("li").hide();
            $("#register").closest("li").hide();
        },
        error: function () {
            // User is not logged in, hide the buttons
            $("#chatPage").closest("li").hide();
            $("#filterCreatedPost").closest("li").hide();
            $("#filterLikedPost").closest("li").hide();
            $("#createPost").closest("li").hide();
            $("#logout").closest("li").hide();
            //
            $("#login").closest("li").show();
            $("#register").closest("li").show();

        }
    });

    // Hide the specified nav items


    // Optional: Remove the alert if not needed
    // alert("Hello");

});


function switchContent(page) {
    if (event) {
        event.preventDefault();
    }
    switch (page) {
        case "home":
            document.getElementById("pageContent").innerHTML = `
        {{define "content"}}
<script src="front-end/static/js/scripts.js"></script>
<!-- Page Content-->
<div class="container px-4 px-lg-5">
    <!-- Heading Row-->

    <!-- Call to Action-->
    <div class="card text-white bg-secondary my-5 py-4 text-center">
        <div class="card-body">
            <p class="text-white m-0">Explore, engage, and expand your knowledge with our community forum.</p>
        </div>
    </div>
    <div class="mb-3 d-flex flex-row gap-2">
        <label for="categories" class="m-auto">Categories</label>
        <select class="form-control" name="categories" id="categories">
            <option selected value="All">All</option>
            {{range .Categories}}
            <option value="{{.Name}}">{{.Name}}</option>
            {{end}}
        </select>
    </div>
    <!-- Content Row-->
    <div class="row gx-4 gx-lg-5">
        {{range $post := .Posts}}
        <div class="col-md-4 mb-5 {{range $cat := $post.Categories}} {{$cat}} {{end}}" id="{{$post.ID}}">
            <div class="card h-100">
                <div class="card-body">
                    <h2 class="card-title">{{$post.Title}}</h2>
                    <p class="card-text">{{$post.Content}}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div class="col">
                        <div class="row">
                            <p class="mb-0"><strong>{{$post.CreatedBy}}</strong></p>
                            <p class="mb-0 text-muted"> {{$post.CreatedOn}}</p>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="row">
                            <div class="d-flex flex-row-reverse mb-2 gap-2">
                                <button type="button" id="dislike-btn-{{$post.ID}}"
                                    onclick="likeDislikePost('{{$post.ID}}','dislike')"
                                    class="btn btn-outline-danger btn-sm {{if $post.Like.IsDisliked}} custom-hover-dislike {{end}}">
                                    <p id="dislike-count-{{$post.ID}}" class="d-inline">
                                        {{$post.Like.CountDislikes}}
                                    </p>
                                    <i class="bi bi-hand-thumbs-down"></i>
                                </button>
                                <button type="button" id="like-btn-{{$post.ID}}"
                                    onclick="likeDislikePost('{{$post.ID}}','like')"
                                    class="btn btn-outline-success btn-sm {{if $post.Like.IsLiked}} custom-hover-like {{end}}">
                                    <p id="like-count-{{$post.ID}}" class="d-inline">
                                        {{$post.Like.CountLikes}}
                                    </p>
                                    <i class="bi bi-hand-thumbs-up"></i>
                                </button>
                            </div>
                        </div>
                        <a class="btn btn-primary btn-sm" href="/post?id={{$post.ID}}">View Comments</a>
                    </div>
                </div>
            </div>
        </div>
        {{end}}
    </div>
</div>
<script>
    $("#categories").on("change", function () {
        const category = $(this).val();
        if (category === "All") {
            $(".col-md-4").show();
        } else {
            $(".col-md-4").hide();
            $("." + category).show();
        }
    }); 
</script>
<script>
    document.addEventListener('DOMContentLoaded', (event) => {
        document.getElementById('categories').value = 'All';
    });
</script>
{{end}}
`
            break;
        case "createPost":
            document.getElementById("pageContent").innerHTML = `
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
                <textarea required class="form-control" name="content" id="content" rows="5"
                    placeholder="Enter content"></textarea>
            </div>
            <label for="content">Categories: </label>
            <div class="form-group mb-3">
                {{range .Categories}}
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="categories" value="{{.Name}}" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                        {{.Name}}
                    </label>
                </div>
            </div>
            <button id='create-btn' type="button" onclick="creatPost()" class="btn btn-primary btn-block">Create Post</button>
        </div>
    </div>
</div>
<br>
<script>
    function creatPost() {
        const createBtn = document.getElementById('create-btn');
        createBtn.disabled = true;

        const title = $("#title").val();
        const content = $("#content").val();
        const categories = [];
        $.each($("input[name='categories']:checked"), function () {
            categories.push($(this).val());
        });

        //check if the title and content is empty or contain only spaces
        if (title.trim() === "" || content.trim() === "") {
            $("#error").html("Title and Content are required");
            $("#error").show();
            $("#error").removeClass("d-none");
            createBtn.disabled = false;
            $("#error").fadeOut(3000);
            return;
        }

        //check if the categories is empty
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
            data: data,  // Send the JSON data object
            success: function (response) {
                $("#success").html("Post Created Successfully");  // Display the success message
                $("#success").show();
                $("#success").removeClass("d-none");

                setTimeout(() => {
                    location.href = 'post?id=' + response
                }, 3e3)
            },
            error: function (error) {
                $("#error").html(error.responseText);  // Display the error message
                $("#error").show();
                $("#error").removeClass("d-none");
                createBtn.disabled = false;
            }
        });
    }
</script>
<script>
    $("input").on("keypress", function () {
        $("#error").hide();
        $("#success").hide();
        $("#error").addClass("d-none");
        $("#success").addClass("d-none");
    });
</script>
{{end}}`
            break;
        case "register":
            document.getElementById("pageContent").innerHTML = `
            <script src="front-end/static/js/scripts.js"></script>
<div class="container px-4 px-lg-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <h2 class="text-center mt-5 mb-4">Register</h2>
            <div class="alert alert-danger d-none" id="error"></div>
            <div class="form-group mb-3">
                <label for="username">Username</label>
                <input type="text" class="form-control" name="username" id="username" placeholder="Enter username">
            </div>
            <div class="form-group mb-3">
                <label for="age">Age</label>
                <input type="text" class="form-control" name="age" id="age" placeholder="Enter age">
            </div>
            <div class="form-group mb-3">
                <label for="firstName">First Name</label>
                <input type="text" class="form-control" name="firstName" id="firstName" placeholder="Enter first name">
            </div>
            <div class="form-group mb-3">
                <label for="lastName">Last Name</label>
                <input type="text" class="form-control" name="lastName" id="lastName" placeholder="Enter last name">
            </div>
            <div class="form-group mb-3">
                <label for="email">Email address</label>
                <input type="email" class="form-control" name="email" id="email" placeholder="Enter email">
            </div>

            <div class="form-group mb-3">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password" id="password" placeholder="Password">
            </div>
            <button type="submit" onclick="registerAction()" class="btn btn-primary btn-block">Register</button>
        </div>
    </div>
</div>
<br>`
            break;
        case "login":
            document.getElementById("pageContent").innerHTML = `
<script src="front-end/static/js/scripts.js"></script>
<div class="container px-4 px-lg-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <h2 class="text-center mt-5 mb-4">Login</h2>
            <div class="alert alert-danger d-none" id="error"></div>
            <div class="form-group mb-3">
                <label for="email">Email address or Username</label>
                <input type="email" class="form-control" name="email" id="email" placeholder="Enter email or Username">
            </div>
            <div class="form-group mb-3">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password" id="password" placeholder="Password">
            </div>
            <button type="submit" onclick="loginAction()" class="btn btn-primary btn-block">Login</button>
            <div id="error" style="display:none;color:red;"></div>
        </div>
    </div>
</div>
<br>`
    }
}
