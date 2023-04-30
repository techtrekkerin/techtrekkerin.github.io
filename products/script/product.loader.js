productsJsonLink = "/products/products/products.json";

window.onload = function() {
    fetchProducts();
    //alert("On Load");
}

function fetchProducts() {
    //alert("fetching products");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var productsJson = JSON.parse(this.responseText);
            populateProductsInDom(productsJson);
        }
    };
    xhttp.open("GET", productsJsonLink, true);
    xhttp.send();
}

function populateProductsInDom(productsJson) {
    var productRow = document.getElementById("products-row");
    var productsArray = productsJson.products;
    for(var i = 0; i < productsArray.length; i++) {
        var product = productsArray[i];
        productRow.appendChild(getSingleProductDiv(product));
    }
}

function getSingleProductDiv(product) {
    var mainDiv = document.createElement("div");
    mainDiv.className = "col-6 col-sm-4 col-md-3 col-lg-3";

    var cardDiv = document.createElement("div");
    cardDiv.className = "card product-card";

    var img = document.createElement("img");
    img.className = "card-img-top";
    img.alt = product.name;
    img.src = product.image_link;
    cardDiv.appendChild(img);

    var cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";

    var anchor = document.createElement("a");
    anchor.className = "btn stretched-link text-truncate btn-outline-secondary";
    anchor.href = product.buy_link;
    anchor.target = "_blank";
    anchor.innerHTML = product.name;
    cardBodyDiv.appendChild(anchor);

    cardDiv.appendChild(cardBodyDiv);

    mainDiv.appendChild(cardDiv);

    return mainDiv;
}