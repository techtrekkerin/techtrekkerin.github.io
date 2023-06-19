const websiteIconBaseUrl = "/images/";
const productsJsonLink = "/products/products/products.json";
const websiteIconSuffix = "_icon.png";
const categoryKey = "category";
const defaultProductsPath = "/products/";

//const productsFilePath = "/products/products.json";

const defaultCategory = "all products";
categories = undefined;
products = undefined;
selectedCategory = "all products";

refPath = undefined;



window.onload = function() {
    fetchProducts();
    setSelectedCategoryFromUrl();
}

function getNthIndexOfSlash(path, nth) {
    var count = 0;
    for(var i = 0; i < path.length; i++) {
        if(path[i] == "/") {
            count++;
            if(count == nth) {
                return i;
            }
        }
    }

    return -1;

}


function getRefPath() {
    if(refPath != undefined) {
        return refPath;
    }
    var path = window.location.pathname;
    refPath = path;
    //var secondSlashIndex = getNthIndexOfSlash(path, 2);
    //refPath = path.substring(1, secondSlashIndex);
    return refPath;
}

function setSelectedCategoryFromUrl() {

    url = new URL(window.location.href);
    searchParams = url.searchParams;
    selectedCategory = searchParams.get(categoryKey);

}

function getSelectedCategory() {
    if(selectedCategory == null || selectedCategory == undefined) {
        return defaultCategory;
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
    searchParams.set(categoryKey, getSelectedCategory());
    window.history.replaceState(null, null, url);
}

function addCategoriesToSelect() {
    var selectElement = document.getElementById("category-selector");
    selectElement.onchange = function() {
        
        selectedCategory = selectElement.value;
        populateProductsInDom(selectedCategory);

    }

    var option = document.createElement("option");
    option.value = defaultCategory;
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

    document.title = getCapitalizeText(category + " | Tech Trekker");
    setCategoryInUrlParams();

    var productRow = document.getElementById("products-row");
    productRow.innerHTML = "";

    var productsArray = getProductsArrayByCategory(category);
    productsArray.sort(sortByProperty("priority"));

    for(var i = 0; i < productsArray.length; i++) {
        var product = productsArray[i];
        
        if(defaultProductsPath.localeCompare(getRefPath()) == 0
         ||  product.paths.includes(getRefPath())) {
            productRow.appendChild(getSingleProductDiv(product));
        }
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

    var titleDiv = document.createElement("div");
    titleDiv.className = "card-title";
    titleDiv.innerHTML = getCapitalizeText(product.name);
    cardBodyDiv.appendChild(titleDiv);

    var anchor = document.createElement("a");
    anchor.className = "btn stretched-link text-truncate btn-outline-secondary";
    anchor.href = product.buy_link;
    anchor.target = "_blank";
    //anchor.innerHTML = "Buy at " + getCapitalizeText(product.website);
    
    var buyAtSpan = document.createElement("span");
    buyAtSpan.innerHTML = "Buy at";
    anchor.appendChild(buyAtSpan);

    var websiteIcon = document.createElement("img");
    websiteIcon.className = "website-icon";
    websiteIcon.src = websiteIconBaseUrl + product.website + websiteIconSuffix;
    anchor.appendChild(websiteIcon);

    cardBodyDiv.appendChild(anchor);

    cardDiv.appendChild(cardBodyDiv);

    mainDiv.appendChild(cardDiv);

    return mainDiv;
}