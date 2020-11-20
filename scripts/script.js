// Utility functions

function showLoadingSpinner() {
  console.log("show");
}

function hideLoadingSpinner() {
  console.log("hide");
}

function populatePostTiles(id, posts) {
  const row = document.getElementById(id);

  posts.forEach((post) => {
    const column = document.createElement("div");
    const heading = document.createElement("h6");
    const body = document.createElement("p");

    row.style.display = "none";
    row.offsetHeight;

    column.setAttribute("class", "col-md-3 col-sm-12 text-center");
    heading.textContent = post.title;
    body.textContent = post.body;

    column.appendChild(heading);
    column.appendChild(body);

    row.appendChild(column);
  });

  row.style.display = "block";
}

function showPosts(posts) {
  loadPosts()
    .then((posts) => populatePostTiles("posts", posts))
    .catch(handlePopulatePostsFailure);
}

function handlePopulatePostsFailure(error) {
  alert(error);
}

async function showMorePosts(posts) {
  try {
    const posts = await loadPosts({ additional: true });
    populatePostTiles("more-posts", posts);
  } catch (error) {
    handlePopulatePostsFailure(error);
  }
}

function loadPosts(config = { additional: false }) {
  const API_BASE_URL = "https://jsonplaceholder.typicode.com";
  const API_POST_URL = `${API_BASE_URL}/posts`;

  showLoadingSpinner();

  return fetch(API_POST_URL)
    .then((response) => response.json())
    .then((json) => {
      const start = config.additional ? 4 : 0;
      const end = config.additional ? 8 : 4;

      return json.slice(start, end);
    })
    .catch((error) => console.error(error))
    .finally(hideLoadingSpinner);
}

// Startup logic

window.addEventListener("load", (event) => {
  showPosts();

  // TODO - remove this
  // showMorePosts();
});
