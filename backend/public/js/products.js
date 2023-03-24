const productsContainer = document.querySelector("#productsContainer");
const buyButton = document.createElement("button").setAttribute("id", "buyButton");
// !VER TEMA DE EL BOTON DE COMPRA
document.addEventListener("DOMContentLoaded", () => {
  getAllProducts();
  console.log(buyButton);
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
    const newItem = allProductsHTML.forEach((itemHTML) => {
        productsContainer.appendChild(itemHTML);
    })

    // Los muestra en el HTML
    productsContainer.append(newItem);
  } catch (error) {
    console.error(error);
  }
};

// TODO: Crea el template del producto y lo devuelve
const createItemsHTML = (item) => {
  const newItem = document.createElement("div");
  newItem.classList.add("flex", "flex-col", "flex-wrap", "bg-slate-100", "p-5", "h-full", "shadow-lg", "rounded")

  newItem.innerHTML = `
    <h2 class="text-center font-bold text-xl">${item.name}</h2>
    <img src="${item.photo}" class="w-[300px] h-[200px] p-2" alt="product-photo">
    <p class="font-bold"><span class="text-indigo-500 font-bold">Description:</span> ${item.description}</p>
    <p class="font-bold"><span class="text-indigo-500 font-bold">Code:</span> #${item.code}</p>
    <p class="font-bold"><span class="text-indigo-500 font-bold">Price:</span> $${item.price}</p>
    <p class="font-bold"><span class="text-indigo-500 font-bold">Stock:</span> ${item.stock}</p>
    <div class="flex justify-center">
        <button id="buyButton" class="bg-indigo-500 w-[150px] p-2 mt-3 rounded shadow-lg font-bold hover:bg-indigo-700 hover:text-white transition-all duration-300">Buy</button>
    </div>
`;

  return newItem
};
