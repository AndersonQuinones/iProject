// Utility functions

function loadPosts(config = { additional: false }) {
  const API_BASE_URL = "https://jsonplaceholder.typicode.com";
  const API_POST_URL = `${API_BASE_URL}/posts`;

  return fetch(API_POST_URL)
    .then((response) => response.json())
    .then((json) => {
      // Toggle between (0, 3) and (4, 7) subarray of posts
      const start = config.additional ? 4 : 0;
      const end = config.additional ? 8 : 4;

      return json.slice(start, end);
    })
    .catch((error) => console.error(error));
}

function populatePostTiles(id, posts) {
  const row = document.getElementById(id); // Find the rowt hat contains the posts placeholders
  const children = Array.from(row.children); // Convert HTMLCollection into standarda rray

  // Create a pairing between the child elements and the posts
  let pairs = children.map((child, index) => {
    const title = child.getElementsByTagName("h3")[0];
    const body = child.getElementsByTagName("p")[0];

    return {
      title: title,
      body: body,
      post: posts[index],
    };
  });

  // Loop through the pairs and set the content of each HTML element
  for (pair of pairs) {
    pair.title.textContent = pair.post.title;
    pair.body.textContent = pair.post.body;
  }

  row.setAttribute("class", "row visible");
}

function showPosts() {
  loadPosts()
    .then((posts) => populatePostTiles("posts-row", posts))
    .catch(handlePopulatePostsFailure);
}

function handlePopulatePostsFailure(error) {
  alert(error); // TODO: Add user-friendly message, log error for dev / debugging purposes
}

async function showMorePosts() {
  try {
    const posts = await loadPosts({ additional: true });
    populatePostTiles("more-posts-row", posts);
  } catch (error) {
    handlePopulatePostsFailure(error);
  }
}

// Startup logic

window.addEventListener("load", (event) => {
  showPosts();
});
