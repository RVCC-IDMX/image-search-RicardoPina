const form = document.querySelector('.search-form');
const container = document.querySelector('.container');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const response = await fetch('/.netlify/functions/unsplash-search', {
    method: 'POST',
    body: JSON.stringify({
      query: formData.get('query'),
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  try {
    response.results.forEach((dataObj) => {
      const cardClone = document.querySelector('#template').content.firstElementChild.cloneNode(true);
      const postImg = cardClone.querySelector('.post__img');
      const postUser = cardClone.querySelector('.post__user');
      const postDescription = cardClone.querySelector('.post__desc');

      if (dataObj.user.first_name || dataObj.user.last_name) {
        postUser.textContent = `by ${dataObj.user.first_name || ''} ${dataObj.user.last_name || ''}`;
      }

      let shortDescription = dataObj.description;
      if (shortDescription) {
        if (typeof shortDescription === 'string' && shortDescription.length > 100) {
          shortDescription = `${shortDescription.slice(0, 100)}...`;
        }
      } else {
        shortDescription = '';
      }

      postImg.src = dataObj.urls.small;
      postImg.alt = dataObj.alt_description;

      postDescription.textContent = `${shortDescription}`;

      container.appendChild(cardClone);
    });
    // }
  } catch (error) {
    container.textContent = 'An error has occured.';
  }
});
