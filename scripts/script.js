// Utility functions

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

let postStartIndex = 0;

function loadPhotos(posts) {
  // Execute each fetch fequest concurrently (not in sequence)
  const promises = posts.map((post) => {
    return (
      fetch(`${API_BASE_URL}/photos/${post.id}`)
        // 1. Download the image data
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch image data");
          }
        })

        // 2. Add image URL to the corresponding post
        .then((photo) => {
          return {
            title: post.title,
            body: post.body,
            imgUrl: photo.thumbnailUrl,
          };
        })

        // 3. Recover from error by injecting a placeholder image
        .catch((error) => {
          console.error(error);

          return Promise.resolve({
            title: post.title,
            body: post.body,
            imgUrl: "images/post-placeholder.png",
          });
        })
    );
  });

  // Convert to a single promise that contains an array of all of the values
  return Promise.all(promises);
}

function loadPosts() {
  return fetch(`${API_BASE_URL}/posts`)
    .then((response) => response.json())
    .then((json) => {
      // Toggle between (0, 3) and (4, 7) subarray of posts
      const posts = json.slice(postStartIndex, postStartIndex + 4);

      postStartIndex += 4;

      return posts;
    })
    .then(loadPhotos)
    .catch((error) => console.error(error));
}

function populatePostTiles(posts) {
  const row = document.getElementById("posts-row");

  posts.forEach((post) => {
    const column = document.createElement("div");
    const image = document.createElement("img");
    const heading = document.createElement("h6");
    const body = document.createElement("p");

    column.setAttribute("class", "col-md-3 col-sm-12 text-center");
    image.src = post.imgUrl;
    heading.textContent = post.title;
    body.textContent = post.body;

    column.appendChild(image);
    column.appendChild(heading);
    column.appendChild(body);

    row.appendChild(column);
  });

  row.setAttribute("class", "row visible");
}

function handlePopulatePostsFailure(error) {
  console.error(error);
  alert("Oops, something went wrong. We are sorry for the inconvience!");
}

function showPosts() {
  loadPosts().then(populatePostTiles).catch(handlePopulatePostsFailure);
}

// Startup logic

window.addEventListener("load", showPosts);
