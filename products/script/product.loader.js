const productsJsonLink = "/products/products/products.json";

categories = undefined;
products = undefined;
selectedCategory = "all";


window.onload = function() {
    fetchProducts();
    setSelectedCategoryFromUrl();
}

function setSelectedCategoryFromUrl() {

    url = new URL(window.location.href);
    searchParams = url.searchParams;
    selectedCategory = searchParams.get("categ");

}

function getSelectedCategory() {
    if(selectedCategory == null || selectedCategory == undefined) {
        return "all";
    }

    return selectedCategory;
}

function fetchProducts() {
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var allProductsJson = JSON.parse(this.responseText);
            products = allProductsJson.products;
            setAllCategories();
            populateProductsInDom(getSelectedCategory());
        }
    };
    xhttp.open("GET", productsJsonLink, true);
    xhttp.send();
}

function setAllCategories() {
    var categorySet = new Set();
    for(var i = 0; i < products.length; i++) {
        categorySet.add(products[i].category);
    }
    categories = Array.from(categorySet);
    addCategoriesToSelect();
}

function getCapitalizeText(text) {
    var splitStr = text.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }

    return splitStr.join(' '); 
}

function setCategoryInUrlParams() {
    searchParams.set("categ", selectedCategory);
    window.history.replaceState(null, null, url);
}

function addCategoriesToSelect() {
    var selectElement = document.getElementById("category-selector");
    selectElement.onchange = function() {
        
        selectedCategory = selectElement.value;
        setCategoryInUrlParams();
        populateProductsInDom(selectedCategory);

    }

    var option = document.createElement("option");
    option.value = "all";
    option.innerHTML = getCapitalizeText("All Products");
    selectElement.appendChild(option);
    
    categories.sort(function(a,b){return a.localeCompare(b); });

    for(var i = 0; i < categories.length; i++) {
        var option = document.createElement("option");
        option.value = categories[i];
        option.innerHTML = getCapitalizeText(categories[i]);
        selectElement.appendChild(option);
    }

    if(categories.includes(selectedCategory)) {
        selectElement.value = selectedCategory;
    }
}

function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
 }

 function getProductsArrayByCategory(category) {
   
    if(category == undefined || category == null || category.localeCompare("all") == 0) {
        return products;
    }

    var productsArray = [];
    for(var i = 0; i < products.length; i++) {
        var product = products[i];
        if(product.category.localeCompare(category) == 0) {
            productsArray.push(product);
        }
    }

    if(productsArray.length == 0) {
        return products;
    }

    return productsArray;

 }

function populateProductsInDom(category) {
    var productRow = document.getElementById("products-row");
    productRow.innerHTML = "";

    var productsArray = getProductsArrayByCategory(category);
    productsArray.sort(sortByProperty("priority"));

    for(var i = 0; i < productsArray.length; i++) {
        var product = productsArray[i];
        productRow.appendChild(getSingleProductDiv(product));
    }
}

function getSingleProductDiv(product) {
    var mainDiv = document.createElement("div");
    mainDiv.className = "col-6 col-sm-4 col-md-3 col-lg-2";

    var cardDiv = document.createElement("div");
    cardDiv.className = "card product-card";

    var img = document.createElement("img");
    img.className = "card-img-top lazy";
    img.loading = "lazy";
    img.alt = product.name;
    img.src = product.image_link;
    cardDiv.appendChild(img);

    var cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";

    var anchor = document.createElement("a");
    anchor.className = "btn stretched-link text-truncate btn-outline-secondary";
    anchor.href = product.buy_link;
    anchor.target = "_blank";
    anchor.innerHTML = getCapitalizeText(product.name);
    cardBodyDiv.appendChild(anchor);

    cardDiv.appendChild(cardBodyDiv);

    mainDiv.appendChild(cardDiv);

    return mainDiv;
}