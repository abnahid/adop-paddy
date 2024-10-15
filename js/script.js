const adoptContainer = document.getElementById("adopt-container");
document.getElementById("view-more").addEventListener("click", function () {
  adoptContainer.scrollIntoView({ behavior: "smooth" });
});

let sortPets = [];

// Load All Posts
const loadAllPosts = () => {
  const spinner = document.getElementById("spinner");
  const postContainers = document.getElementById("post-container");
  spinner.classList.remove("hidden");
  postContainers.classList.add("hidden");

  fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((res) => res.json())
    .then((data) => {
      setTimeout(() => {
        spinner.classList.add("hidden");
        postContainers.classList.remove("hidden");

        displayAllPosts(data.pets);
      }, 2000);
    })
    .catch((error) => console.log(error));
};

// Categories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => displayCatagories(data.categories))
    .catch((err) => console.log(err));
};

const loadCategoryPost = (category) => {
  const spinner = document.getElementById("spinner");
  const postContainers = document.getElementById("post-container");

  spinner.classList.remove("hidden");
  postContainers.classList.add("hidden");

  fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
    .then((res) => res.json())
    .then((data) => {
      setTimeout(() => {
        spinner.classList.add("hidden");
        postContainers.classList.remove("hidden");

        displayAllPosts(data.data);
      }, 2000);
    })
    .catch((err) => console.log(err));
};

// Display Pets

const displayAllPosts = (pets) => {
  const postContainer = document.getElementById("pats-post");
  postContainer.innerHTML = "";

  if (!pets || pets.length == 0) {
    postContainer.classList.remove("grid");
    postContainer.innerHTML = `
        <div
                class="flex items-center justify-center" >
                <div class="flex flex-col gap-5 justify-center items-center">
                    <img src="images/error.webp" alt="" />
                    <h2 class="text-center font-bold text-3xl">No content here is this category</h2>
                    <p class="text-center font-medium w-3/4">Currently, there is no information available. Please
                        revisit
                        later for updates. We appreciate
                        your understanding.</p>
                </div>
            </div>
        `;
    return;
  } else {
    postContainer.classList.add("grid");
  }
  const displayPetsByPrice = pets
    .map((sortPet) => ({
      petId: sortPet.petId,
      pet_name: sortPet.pet_name,
      gender: sortPet.gender,
      image: sortPet.image,
      price: sortPet.price,
      date_of_birth: sortPet.date_of_birth,
      category: sortPet.category,
      breed: sortPet.breed,
    }))
    .sort((x, y) => y.price - x.price);

  sortPets = displayPetsByPrice;

  pets.forEach((pet) => {
    const card = document.createElement("div");
    card.classList = "flex flex-col border p-4 rounded-xl";
    card.innerHTML = `
      <img loading="lazy" class="object-cover rounded-xl h-4/5" src="${
        pet.image
      }" alt="${pet.pet_name}" />

      <div class="flex flex-col mt-2 gap-1">
        <h4 class="font-bold">${pet.pet_name || "Unknown"}</h4>
        <div class="flex gap-2">
          <img src="images/category-svgrepo-com.png" alt="" class="size-5 opacity-85">
          <p>Breed: ${pet.breed || "Unknown"}</p>
        </div>
        <p><i class="fa-light fa-calendar mr-2"></i>Birth: ${
          pet.date_of_birth || "No Date of Birth"
        }</p>
        <p><i class="fa-regular fa-mercury mr-2"></i>Gender: ${
          pet.gender || "Unknown"
        }</p>
        <p><i class="fa-solid fa-dollar-sign mr-2"></i> Price: ${
          pet.price || "Price not available"
        }</p>
      </div>
      
      <div class="divider"></div>
      
      <div class="flex justify-between">
        <button class="py-2 px-3 rounded-xl font-bold text-lg text-buttonPrimary border" onclick="likedPet('${
          pet.image
        }')">
          <i class="fa-light fa-thumbs-up"></i>
        </button>
        <button onclick="countDown(this)"
        }')" class="py-2 px-4 rounded-xl font-bold text-lg text-buttonPrimary border">
          Adopt
        </button>
        <button onclick="displayDetails('${
          pet.petId
        }')" class="py-2 px-4 rounded-xl font-bold text-lg text-buttonPrimary border">
          Details
        </button>
      </div>
    `;

    postContainer.appendChild(card);
  });
};

// Display Categories
const displayCatagories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  categoryContainer.innerHTML = "";

  categories.forEach((item) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList =
      "btn btn-lg min-h-20 bg-inherit shadow-inherit border rounded-2xl hover:bg-green-600 hover:border-green-600 hover:bg-opacity-10 hover:rounded-full category-btn";

    buttonContainer.innerHTML = `
             <button id="btn-${item.id}" onclick="loadCategoryPost('${item.category}')" class="flex items-center space-x-4">
                <img src="${item.category_icon}" alt="${item.category}" class="size-10 mr-2 category-icon">
                <p class="text-2xl font-bold text-gray-900">${item.category}</p>
            </button>     
        `;

    categoryContainer.append(buttonContainer);
  });
};

// Liked Pet
const likedPet = async (image) => {
  const likedPets = document.getElementById("liked-pets");

  const div = document.createElement("div");
  div.innerHTML = `
  <div>
    <img class="rounded-xl" src="${image}">
  </div>
  `;

  likedPets.append(div);
};

// pet Adopt
const countDown = (button) => {
  let countdown = 3;
  const countdownModal = document.getElementById("AdopModal");
  const countdownText = document.getElementById("countdown");

  // Show the modal
  countdownModal.showModal();
  button.classList.add("bg-gray-400", "text-white", "cursor-not-allowed");
  button.classList.remove("text-buttonPrimary");

  // Countdown logic
  const countdownInterval = setInterval(() => {
    countdownText.textContent = countdown;
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);

      button.textContent = "Adopted";
      button.disabled = true;

      countdownModal.close();
    }
  }, 1000);
};

// Display Details
document
  .getElementById("showModalData")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const petId = this.dataset.petId;
    displayDetails(petId);
  });

const displayDetails = async (petId) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
  );

  const data = await response.json();
  const pet = data.petData;

  const detailsContainer = document.getElementById("modal-content");

  detailsContainer.innerHTML = `
    <img class="rounded-lg w-full object-cover" src="${pet.image}" alt="${
    pet.pet_name || "Unknown Pet"
  }" />
    <div class="card-body p-0 py-4">
      <div class="flex flex-col space-y-4">
        <h2 class="card-title text-2xl font-bold text-gray-900">${
          pet.pet_name || "Unknown"
        }</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div class="flex items-center space-x-2">
            <img src="images/category-svgrepo-com.png" alt="Breed Icon" class="w-5 opacity-85" />
            <p class="text-base text-gray-700">Breed: ${
              pet.breed || "Unknown"
            }</p>
          </div>
          <div class="flex items-center space-x-2">
            <i class="fa-light fa-calendar mr-2"></i>
            <p class="text-base text-gray-700">Birth: ${
              pet.date_of_birth || "Not specified"
            }</p>
          </div>
          <div class="flex items-center space-x-2">
            <i class="fa-regular fa-mercury mr-2"></i>
            <p class="text-base text-gray-700">Gender: ${
              pet.gender || "Unknown"
            }</p>
          </div>
          <div class="flex items-center space-x-2">
            <i class="fa-solid fa-dollar-sign mr-2"></i>
            <p class="text-base text-gray-700">Price: ${
              pet.price || "Not available"
            }</p>
          </div>
          <div class="flex items-center space-x-2 col-span-2">
            <i class="fa-solid fa-syringe mr-2"></i>
            <p class="text-base text-gray-700">Vaccinated status: ${
              pet.vaccinated_status || "Not specified"
            }</p>
          </div>
        </div>
      </div>
      <div class="divider mt-0 mb-0"></div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Details Information</h3>
        <p class="text-base text-gray-700 text-justify">${
          pet.pet_details || "No additional information available."
        }</p>
      </div>
      <div class="modal-action inline">
        <button class="btn btn-outline btn-success w-full" id="close-modal">Close</button>
      </div>
    </div>
  `;

  document.getElementById("customModal").showModal();

  document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("customModal").close();
  });
};

const displaySortedPets = () => {
  displayAllPosts(sortPets);
};

// Load Posts and Categories
loadAllPosts();
loadCategories();
