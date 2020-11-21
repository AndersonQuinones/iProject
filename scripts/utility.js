// Global state / constants

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

let postStartIndex = 0;

// Utility functions

function loadPhotos(posts) {
  // Execute each fetch fequest concurrently (not in sequence)
  const promises = posts.map((post) => {
    return (
      fetch(`${API_BASE_URL}/photos/${post.id}`)
        // 1. Download the image data
        .then((response) => {
          // Status code is 200
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
      const posts = json.slice(postStartIndex, postStartIndex + 4);

      postStartIndex += 4;

      return posts;
    })
    .catch((error) => console.error(error));
}

function populatePostTiles(posts) {
  const row = document.getElementById("posts-row");

  posts.forEach((post) => {
    const column = document.createElement("div");
    const image = document.createElement("img");
    const heading = document.createElement("h6");
    const body = document.createElement("p");

    column.setAttribute("class", "col-md-3 col-sm-12 text-center post-tile");
    heading.setAttribute("class", "post-tile-title");
    image.setAttribute("class", "post-tile-img");
    body.setAttribute("class", "post-description");

    image.src = post.imgUrl;
    heading.textContent = post.title;
    body.textContent = post.body;

    column.appendChild(image);
    column.appendChild(heading);
    column.appendChild(body);

    row.appendChild(column);
  });
}

function handlePopulatePostsFailure(error) {
  console.error(error);
  alert("Oops, something went wrong. We are sorry for the inconvience!");
}

function showPosts() {
  loadPosts()
    .then(loadPhotos)
    .then(populatePostTiles)
    .catch(handlePopulatePostsFailure);
}
