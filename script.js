
const recipes = [
  {
    id: '1',
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish.',
    photo_url: 'https://www.allrecipes.com/thmb/Vg2G3_M_GcAxHzJCTnpr2S_i7sU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5155.jpg',
    allergens: ['gluten', 'dairy', 'eggs'],
    difficulty: 'easy',
    rating_avg: 4.5,
  },
  {
    id: '2',
    name: 'Chicken Tikka Masala',
    description: 'A popular Indian curry.',
    photo_url: 'https://www.allrecipes.com/thmb/1b2g_PI_1fC5vG-2tD_R5v8S_pI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/239867-chicken-tikka-masala-DDMFS-4x3-b52f2f2243734e539e2238a49a2c63fa.jpg',
    allergens: ['dairy'],
    difficulty: 'medium',
    rating_avg: 4.8,
  },
  {
    id: '3',
    name: 'Vegan Chili',
    description: 'A hearty and healthy chili.',
    photo_url: 'https://www.allrecipes.com/thmb/q8c0c_f_j5-2-E_A_bO-8_Z_j_s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/452681-vegan-chili-DDMFS-4x3-2edc63a6e5d14f279033e23948f02d61.jpg',
    allergens: [],
    difficulty: 'easy',
    rating_avg: 4.2,
  },
];

const swipeContainer = document.querySelector('.swipe-container');
const likeButton = document.getElementById('like');
const dislikeButton = document.getElementById('dislike');

let currentCardIndex = 0;

function createCard(recipe) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${recipe.photo_url}" alt="${recipe.name}">
    <div class="card-content">
      <h2>${recipe.name}</h2>
      <p>${recipe.description}</p>
      <div class="info">
        <span>${recipe.difficulty}</span>
        <span>${recipe.rating_avg} ★</span>
      </div>
    </div>
  `;
  return card;
}

function renderCards() {
  swipeContainer.innerHTML = '';
  if (currentCardIndex < recipes.length) {
    const recipe = recipes[currentCardIndex];
    const card = createCard(recipe);
    swipeContainer.appendChild(card);
    addSwipeListeners(card);
  }
}

function addSwipeListeners(card) {
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  function onStart(event) {
    startX = event.clientX ?? event.touches[0].clientX;
    startY = event.clientY ?? event.touches[0].clientY;
    isDragging = true;
    card.classList.add('dragging');
  }

  function onMove(event) {
    if (!isDragging) return;
    const currentX = event.clientX ?? event.touches[0].clientX;
    const diffX = currentX - startX;
    const rotate = diffX * 0.1;
    card.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;
  }

  function onEnd(event) {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('dragging');
    const currentX = event.clientX ?? event.changedTouches[0].clientX;
    const diffX = currentX - startX;

    if (Math.abs(diffX) > 100) {
      const direction = diffX > 0 ? 1 : -1;
      swipeCard(direction);
    } else {
      card.style.transform = 'translateX(0) rotate(0deg)';
    }
  }

  card.addEventListener('mousedown', onStart);
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseup', onEnd);
  card.addEventListener('mouseleave', onEnd);

  card.addEventListener('touchstart', onStart);
  card.addEventListener('touchmove', onMove);
  card.addEventListener('touchend', onEnd);
}

function swipeCard(direction) {
  const card = swipeContainer.querySelector('.card');
  if (!card) return;

  const endX = direction * (window.innerWidth / 2 + card.offsetWidth);
  card.style.transform = `translateX(${endX}px) rotate(${direction * 30}deg)`;
  card.style.opacity = 0;

  setTimeout(() => {
    currentCardIndex++;
    renderCards();
  }, 300);
}

likeButton.addEventListener('click', () => swipeCard(1));
dislikeButton.addEventListener('click', () => swipeCard(-1));

renderCards();
