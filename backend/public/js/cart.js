const productsContainer = document.querySelector("#productsContainer");
const totalPriceContainer = document.querySelector("#totalPrice");
const makeOrderButton = document.querySelector("#makeOrderButton");

document.addEventListener("DOMContentLoaded", () => {
    getCart();
    makeOrderButton.addEventListener("click", makeAnOrder);
})

const getCartId = async () => {
    try {
        const response = await fetch("/api/users/userDescription");
        const user = await response.json();

        return user.cart;
    } catch (error) {
        console.error(error);
    }
}

const getCart = async () => {
    try {
        const cart = await getCartId();
        const response = await fetch(`/api/carrito/${cart}/productos`);
        const products = await response.json();

        const productItems = products.cart.products;

        // Agregar el siguiente código
        const allProducts = productItems.map(item => item);

        const productList = document.createElement("ul");
        allProducts.forEach(item => {
            const products = document.createElement("li");
            
            const price = document.createElement("p");
            price.id = "price"
            price.innerHTML = `<span class="text-indigo-500 font-bold">Price: </span> $${item.price}`;
            price.classList.add("font-bold");

            const quantity = document.createElement("p");
            quantity.id = "quantity"
            quantity.innerHTML = `<span class="text-indigo-500 font-bold">Quantity: </span> ${item.quantity}`;
            quantity.classList.add("font-bold");

            products.innerHTML = `
            <h2 class="text-center font-bold text-xl">${item.name}</h2>
            <img src="${item.photo}" class="w-[300px] h-[200px] p-2" alt="product-photo">
            <p class="font-bold"><span class="text-indigo-500 font-bold">Description:</span> ${item.description}</p>
            <p class="font-bold"><span class="text-indigo-500 font-bold">Code:</span> #${item.code}</p>
            `
            products.append(price, quantity)
            productList.appendChild(products)
        })
        productsContainer.appendChild(productList)
        
    } catch (error) {
        console.error(error);
    } finally {
        showFinalPrice();
    }
}

const showFinalPrice = () => {
    const productsPrices = document.querySelectorAll("#price");
    const productQuantities = document.querySelectorAll("#quantity");
    
    let totalAmount = 0;

    for (let i = 0; i < productsPrices.length; i++) {
        const priceParsed = parseInt(productsPrices[i].textContent.substring(productsPrices[i].textContent.indexOf("$") + 1));
        const quantityParsed = parseInt(productQuantities[i].textContent.substring(productQuantities[i].textContent.indexOf(":") + 1).trim())
        
        const total = priceParsed * quantityParsed;
        totalAmount += total;
    }
    const totalPrice = document.createElement("p");
    totalPrice.textContent = `$${totalAmount}`;
    totalPrice.classList.add("font-bold", "bg-green-200", 'p-1', "rounded");
    totalPriceContainer.append(totalPrice);
}

const makeAnOrder = async () => {
    try {
        const response = await fetch("/api/carrito/makeOrder")
        const data = await response.json();

        if (response.status === 400) {
            alert(data.message);
        } else {
            alert(data.message);
            location.reload();
        }
    } catch (error) {
        console.error(error);
    }
}