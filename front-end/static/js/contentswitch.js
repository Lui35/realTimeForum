// Function to handle navigation
function navigate(event, path, postId) {
    event.preventDefault();
    if (postId) {
        // Append postId as a query parameter
        path += `?postId=${postId}`;
    }
    history.pushState({ path: path }, '', path);
    handleNavigation(path, postId);
}

function handleNavigation(path) {
    const contentContainer = $('#pageContent');
    contentContainer.empty(); // Clear existing content
    
    // Extract postId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    switch (path.split('?')[0]) { // Ignore query parameters in switch case
        case '/':
            loadHomePage();
            break;
        case '/RegisterUser':
            loadRegistrationPage();
            break;
        case '/loginUser':
            loadLoginPage();
            break;
        case '/chat':
            loadChatPage();
            break;
        case '/postDetails':
            if (postId) {
                loadPostDetails(postId);
            } else {
                loadNotFoundPage(); // Handle missing postId
            }
            break;
        case '/createPost':
            loadCreatePost();
            break;
        case '/logout':
            logout();
            break;
        default:
            loadNotFoundPage();
            break;
    }
}


// Function to load Home page content
function loadHomePage() {
    $('#pageContent').html(`
        <div class="container px-4 px-lg-5">
            <div class="card text-white bg-secondary my-5 py-4 text-center">
                <div class="card-body">
                    <p class="text-white m-0">Explore, engage, and expand your knowledge with our community forum.</p>
                </div>
            </div>
            <div class="mb-3 d-flex flex-row gap-2">
                <label for="categories" class="m-auto">Categories</label>
                <select class="form-control" name="categories" id="categories">
                    <option selected value="All">All</option>
                </select>
            </div>
            <div class="row gx-4 gx-lg-5" id="posts-container">
                <!-- Posts will be loaded here -->
            </div>
        </div>
    `);
    debugger;
    fetchCategoriesForDropdown();
    fetchPosts();
}

function fetchCategoriesForDropdown() {
    debugger;
    $.ajax({
        url: "/getCategories",
        type: "post",
        success: function (categories) {
            var categoriesContainer = $("#categories");
            categoriesContainer.empty(); // Clear existing categories
            categoriesContainer.append('<option selected value="All">All</option>');
            categories.forEach(function (category) {
                var categoryOption = `<option value="${category.Name}">${category.Name}</option>`;
                categoriesContainer.append(categoryOption);
            });

            $("#categories").on("change", function () {
                const category = $(this).val();
                if (category === "All") {
                    $(".col-md-4").show();
                } else {
                    $(".col-md-4").hide();
                    $("." + category).show();
                }
            });
        },
        error: function (error) {
            console.error("Error fetching categories:", error);
        }
    });
}

function fetchPosts() {
    debugger;
    $.ajax({
        url: "/getPosts",
        type: "POST",
        success: function (posts) {
            var postsContainer = $("#posts-container");
            postsContainer.empty(); // Clear existing posts

            posts.forEach(function (post) {
                var postHtml = `
                    <div class="col-md-4 mb-5 ${post.Categories.join(' ')}" id="${post.ID}">
                        <div class="card h-100">
                            <div class="card-body">
                                <h2 class="card-title">${post.Title}</h2>
                                <p class="card-text">${post.Content}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between align-items-center">
                                <div class="col">
                                    <div class="row">
                                        <p class="mb-0"><strong>${post.CreatedBy}</strong></p>
                                        <p class="mb-0 text-muted"> ${post.CreatedOn}</p>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="row">
                                        <div class="d-flex flex-row-reverse mb-2 gap-2">
                                            <button type="button" id="dislike-btn-${post.ID}"
                                                onclick="likeDislikePost('${post.ID}','dislike')"
                                                class="btn btn-outline-danger btn-sm ${post.Like.IsDisliked ? 'custom-hover-dislike' : ''}">
                                                <p id="dislike-count-${post.ID}" class="d-inline">
                                                    ${post.Like.CountDislikes}
                                                </p>
                                                <i class="bi bi-hand-thumbs-down"></i>
                                            </button>
                                            <button type="button" id="like-btn-${post.ID}"
                                                onclick="likeDislikePost('${post.ID}','like')"
                                                class="btn btn-outline-success btn-sm ${post.Like.IsLiked ? 'custom-hover-like' : ''}">
                                                <p id="like-count-${post.ID}" class="d-inline">
                                                    ${post.Like.CountLikes}
                                                </p>
                                                <i class="bi bi-hand-thumbs-up"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <a class="btn btn-primary btn-sm" onclick="navigate(event, '/postDetails', ${post.ID})" href="/post?id=${post.ID}">View Comments</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                postsContainer.append(postHtml);
            });
        },
        error: function (error) {
            console.error("Error fetching posts:", error);
        }
    });
}

// Function to load About page content
function loadRegistrationPage() {
    $('#pageContent').html(`
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
                <label>Gender</label><br>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="genderMale" value="male" default checked>
                    <label class="form-check-label" for="genderMale">Male</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="gender" id="genderFemale" value="female">
                    <label class="form-check-label" for="genderFemale">Female</label>
                </div>
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
<br>
    `);
}

// Function to load Contact page content
function loadLoginPage() {
    $('#pageContent').html(`
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
<br>`);
}

function loadPostDetails(postId) {
    $.ajax({
        url: '/getPostDetails',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ postId: parseInt(postId, 10) }), // Convert to integer
        success: function(response) {
            console.log("Response received:", response);         
            // Check if comments exist and create HTML accordingly
            const commentsHtml = response.Comments && response.Comments.length > 0
                ? response.Comments.map(comment => `
                    <div class="card mb-4" id="${comment.ID}">
                        <div class="card-body">
                            <p class="card-text">${comment.Content}</p>
                        </div>
                        <div class="card-footer text-muted">
                            <div class="d-flex flex-row gap-2">
                                <div style="margin: auto auto auto 0">
                                    Posted by ${comment.CreatedBy} on ${comment.CreatedOn}
                                </div>
                                <button type="submit" onclick="likeDislikeComment('${comment.ID}','like')"
                                        id="like-btn-${comment.ID}"
                                        class="btn btn-outline-success btn-sm
                                               ${comment.Like.IsLiked ? 'custom-hover-like' : ''}">
                                    <p id="like-count-${comment.ID}" class="d-inline">
                                        ${comment.Like.CountLikes}
                                    </p>
                                    <i class="bi bi-hand-thumbs-up"></i>
                                </button>
                                <button type="submit" onclick="likeDislikeComment('${comment.ID}','dislike')"
                                    id="dislike-btn-${comment.ID}" class="btn btn-outline-danger btn-sm
                                    ${comment.Like.IsDisliked ? 'custom-hover-dislike' : ''}">
                                    <p id="dislike-count-${comment.ID}" class="d-inline">
                                        ${comment.Like.CountDislikes}
                                    </p>
                                    <i class="bi bi-hand-thumbs-down"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')
                : '<p>No comments yet. Be the first to comment!</p>'; // Message when no comments are present

            $('#pageContent').html(`
                <div class="container px-4 px-lg-5">
                    <div class="row gx-4 gx-lg-5 justify-content-center">
                        <div class="col-lg-8">
                            <h1 class="mt-4">${response.Title}</h1>
                            <p class="lead">${response.Content}</p>
                            <p>by ${response.CreatedBy} - ${response.CreatedOn}</p>
                            <hr>
                            <h2>Comments</h2>
                            <div id="commentsContainer">
                                ${commentsHtml}  <!-- Insert generated comments HTML here -->
                            </div>
                            <hr>
                            <div class="alert alert-danger d-none" id="error"></div>
                            <div class="card my-4">
                                <h5 class="card-header">Leave a Comment:</h5>
                                <div class="card-body">
                                    <div class="form-group mb-3">
                                        <textarea class="form-control" id="comment" rows="3" placeholder="Comment"></textarea>
                                    </div>
                                    <button type="button" onclick="submitComment('${response.ID}')" class="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="/front-end/static/js/comment.js"></script>
            `);
        },
        error: function(error) {
            console.error("Error fetching post details:", error);
        }
    });
}



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
        success: function (categories) {
            var container = $("#categories-container");
            container.empty();  // Clear existing content
            categories.forEach(function (category) {
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
        error: function (error) {
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





// Function to load 404 Not Found page content
function loadNotFoundPage() {
    $('#pageContent').html(`
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
    `);
}

// Event listener for handling browser back/forward navigation
$(window).on('popstate', function (event) {
    handleNavigation(event.originalEvent.state ? event.originalEvent.state.path : window.location.pathname);
});

// In});itial content loading based on the current path
$(document).ready(function () {
    checkIfLoggedin();
    handleNavigation(window.location.pathname);
});



function checkIfLoggedin() {
    $.ajax({
        url: "/authenticateCookieWithJS",
        type: "POST",
        success: function () {
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
}

