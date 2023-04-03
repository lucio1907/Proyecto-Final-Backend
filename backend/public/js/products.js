const productsContainer = document.querySelector("#productsContainer");

document.addEventListener("DOMContentLoaded", () => {
  getAllProducts();
});

// TODO: Obtiene todos los productos y los muestra por pantalla
const getAllProducts = async () => {
  try {
    const response = await fetch("/api/productos");
    const products = await response.json();

    const data = products.allProducts;

    // Mapea todos los productos
    const allProductsHTML = data.map(createItemsHTML);

    // Agrega producto por producto al div de productsContainer
    allProductsHTML.forEach((itemHTML) => {
      productsContainer.appendChild(itemHTML);
    });
  } catch (error) {
    console.error(error);
  }
};

// TODO: Crea el template del producto y lo devuelve
const createItemsHTML = (item) => {
  const newItem = document.createElement("div");
  newItem.classList.add(
    "flex",
    "flex-col",
    "flex-wrap",
    "bg-slate-100",
    "p-5",
    "h-full",
    "shadow-lg",
    "rounded"
  );

  const buyButton = document.createElement("button");
  buyButton.setAttribute("id", "buyButton");
  buyButton.classList.add(
    "bg-indigo-500",
    "w-[150px]",
    "p-2",
    "mt-3",
    "rounded",
    "shadow-lg",
    "font-bold",
    "hover:bg-indigo-700",
    "hover:text-white",
    "transition-all",
    "duration-300"
  );
  buyButton.textContent = "Add to cart";

  const quantityInput = document.createElement("input");
  quantityInput.id = "quantityInput";
  quantityInput.type = "number";
  quantityInput.name = "quantity";
  quantityInput.value = 0;
  quantityInput.placeholder = "Qty";

  quantityInput.addEventListener("input", (e) => {
    if (quantityInput.value < 0) {
      quantityInput.value = 0
    }

    // Si el valor del input es mayor al stock que no se pase de ese valor
    if (quantityInput.value > item.stock) {
      e.target.value = item.stock;
      quantityInput.value = item.stock;
    } else { // Sino habilite nuevamente el boton y asigne a item el valor de qunatity para restarlo en el backend
      item.quantity = parseInt(quantityInput.value);  
    }
  })

  if (item.stock === 0) {
    buyButton.disabled = true;
    buyButton.classList.remove("hover:bg-indigo-700", "hover:text-white")
    buyButton.classList.add("cursor-not-allowed", "bg-slate-500");
    buyButton.textContent = "No stock"
  }

  quantityInput.classList.add(
    "outline-none",
    "text-center",
    "placeholder:text-center",
    "w-[150px]",
    "p-2",
    "mt-3",
    "rounded",
    "shadow-lg",
    "font-bold",
    "transition-all",
    "duration-300"
  );

  const pUnits = document.createElement("p");
  pUnits.textContent = "Uts.";
  pUnits.classList.add("font-bold", "text-slate-400");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("flex", "justify-center", "gap-2", "items-end");
  buttonContainer.appendChild(buyButton);
  buttonContainer.appendChild(quantityInput);
  buttonContainer.appendChild(pUnits);

  addToCart(buyButton, item);

  // Agregar el botón al elemento newItem
  newItem.innerHTML = `
    <h2 class="text-center font-bold text-xl">${item.name}</h2>
    <img src="${item.photo}" class="w-[300px] h-[200px] p-2" alt="product-photo">
    <p class="font-bold"><span class="text-indigo-500 font-bold">Description:</span> ${item.description}</p>
    <p class="font-bold"><span class="text-indigo-500 font-bold">Code:</span> #${item.code}</p>
    <p class="font-bold"><span class="text-indigo-500 font-bold">Price:</span> $${item.price}</p>
    <p class="font-bold"><span class="text-indigo-500 font-bold">Stock:</span> ${item.stock}</p>
  `;
  newItem.appendChild(buttonContainer);

  return newItem;
};

// TODO: Agrega producto al carrito
const addToCart = (buyButton, item) => {
  buyButton.addEventListener("click", async (e) => addToCartOptions(e, item));
};

const addToCartOptions = async (e, item) => {
  if (e.type === "click") {
    try {
      const user = await getUser();

      if (item.quantity > 0 || item.quantity !== undefined) {
        const response = await fetch(`/api/carrito/${user.cart}/productos`, {
          method: "POST",
          body: JSON.stringify(item),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();

        alert(data.msg);
        location.reload();
      } else {
        alert("Cannot add this product if quantity it's 0")
      }
    } catch (error) {
      console.error(error);
    }
  }
};

// TODO: Obtiene usuario para saber el id del carrito
const getUser = async () => {
  try {
    const response = await fetch("/api/users/userDescription");
    const user = await response.json();

    return user;
  } catch (error) {
    console.error(error);
  }
};
