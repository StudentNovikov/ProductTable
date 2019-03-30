class Product {
    constructor(name, count, price) {
        this.name = name;
        this.count = count;
        this.price = price;
    }
}

let productUpdatingId = 0;
const tbody = document.querySelector('tbody');
let filter = '';
const triangleUpIcon = '▽';
const triangleDownIcon = '△';

// We store some initial products, just to improve user experience at this page. 
// Atm don't wan't to confuse them with a starting table being completely empty 
let productArray = [
    new Product('аТовар 1', 5, 2812.43),
    new Product('яТовар 2 секрет', 3, 444516.45),
    new Product('хТовар 3', 3, 2000000.45),
    new Product('вТовар 025', 2, 100)
];

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

function formatCurrency(price) {
    if (price == '' || isNaN(price)) {
        return ''
    }
    return formatter.format(price)
}

window.addEventListener("load", redrawTableBody());

function redrawTableBody() {

    tbody.textContent = '';
    productArray.forEach((product, id) => {
        const tableRow = document.createElement('tr');
        const nameTd = document.createElement('td');
        const nameDiv = document.createElement('div');
        const nameLink = document.createElement('a');
        const nameSpan = document.createElement('span');
        const priceTd = document.createElement('td');
        const actionsTd = document.createElement('td');
        const actionsButtonEdit = document.createElement('button');
        const actionsButtonDelete = document.createElement('button');

        nameTd.className = 'text-left';
        nameDiv.className = 'ml-2 ml-md-3 d-flex justify-content-between align-items-center';
        nameLink.className = 'productLink';
        nameLink.setAttribute('href', '#');
        nameLink.textContent = product.name;
        nameSpan.className = 'badge badge-pill badge-success px-2';
        nameSpan.textContent = product.count;

        nameDiv.appendChild(nameLink);
        nameDiv.appendChild(nameSpan);
        nameTd.appendChild(nameDiv);

        priceTd.textContent = formatCurrency(product.price);

        actionsButtonEdit.className = 'btn btn-outline-dark m-1 mr-lg-2 px-sm-4 btn-edit';
        actionsButtonEdit.setAttribute('data-toggle', 'modal');
        actionsButtonEdit.setAttribute('data-target', '#submitModal');

        actionsButtonEdit.textContent = 'Edit';
        actionsButtonDelete.className = 'btn btn-outline-danger m-1 ml-lg-2 px-sm-4 btn-delete';
        actionsButtonDelete.textContent = 'Delete';
        actionsButtonDelete.setAttribute('data-toggle', 'modal');
        actionsButtonDelete.setAttribute('data-target', '#deleteModal');

        actionsTd.appendChild(actionsButtonEdit);
        actionsTd.appendChild(actionsButtonDelete);

        tableRow.setAttribute('id', id);
        tableRow.appendChild(nameTd);
        tableRow.appendChild(priceTd);
        tableRow.appendChild(actionsTd);

        tbody.appendChild(tableRow);
    });

    // Example of a result table row: 
    // --------------------
    // <tr>
    //  <td class="text-left">
    //   <div class="ml-2 ml-md-3 d-flex justify-content-between align-items-center">
    //      <a href="" class="productLink">Товар 2</a>
    //      <span class="badge badge-pill badge-success px-2">2</span>
    //   </div>
    //  </td>
    //  <td>12.5</td>
    //  <td>
    //      <button class="btn btn-outline-dark m-1 mr-lg-2 px-sm-4 btn-edit">Edit</button>
    //      <button class="btn btn-outline-danger m-1 ml-lg-2 px-sm-4 btn-delete">Delete</button>
    //  </td>
    // </tr>
    // --------------------
}

//Add or Update button
document.getElementById('submitProduct').addEventListener('click', (e) => {
    
    const name = document.getElementById('inputName').value;
    const count = document.getElementById('inputCount').value;
    let price = document.getElementById('inputPrice').value;
    price = price.replace(/\$|,/g, "");

    let formInvalid = validate(name, count, price);

    if (!formInvalid) {
        if (e.target.textContent == 'Update') {
            removeProduct(productUpdatingId);
            productArray.push(new Product(name, count, price));
            productUpdatingId = productArray.length - 1;
        } else {
            productArray.push(new Product(name, count, price));
        }
        redrawTableBody();
        filterProducts(filter);
    }
    e.preventDefault();
})

function validate(name, count, price) {
    let formInvalid = false;
    if (name.length == 0) {
        document.getElementById('name-invalid-feedback').textContent = 'Имя не может быть пустым';
        document.getElementById('inputName').classList.add("is-invalid");
        formInvalid = true;
    }     
    if (!name.replace(/\s/g, '').length || name.length > 15 || parseFloat(count) < 0 || parseFloat(price) < 0) {
        formInvalid = true;
    }   

    return formInvalid
}

function resetValidation() {
    document.getElementById('inputName').classList.remove("is-invalid");
    document.getElementById('inputCount').classList.remove("is-invalid");
    document.getElementById('inputPrice').classList.remove("is-invalid");
}

function cleanInputForm() {
    document.getElementById('inputName').value = '';
    document.getElementById('inputCount').value = '';
    document.getElementById('inputPrice').value = '';
}


// 'Delete' button
let idToDelete;

document.querySelector('table').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        idToDelete = e.target.parentNode.parentNode.getAttribute('id');
    }
    e.preventDefault();
})

document.getElementById('deleteConfirmBtn').addEventListener('click', () => {
    removeProduct(idToDelete);
    redrawTableBody();
    filterProducts(filter);
    resetValidation();
})

function removeProduct(id) {
    productArray.splice(id, 1);
}

// 'Edit' button
document.querySelector('table').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
        productUpdatingId = e.target.parentNode.parentNode.getAttribute('id');
        document.getElementById('inputName').value = productArray[productUpdatingId].name;
        document.getElementById('inputCount').value = productArray[productUpdatingId].count;
        document.getElementById('inputPrice').value = formatCurrency(productArray[productUpdatingId].price);
        document.getElementById('submitProduct').textContent = 'Update';
        e.preventDefault();
    }
})

// 'Add New' button
document.getElementById('addNewBtn').addEventListener('click', () => {
    document.getElementById('submitProduct').textContent = 'Add';
    cleanInputForm();
    resetValidation();
})

document.getElementById('searchBtn').addEventListener('click', (e) => {
    filter = document.getElementById('searchFilter').value.toUpperCase();
    filterProducts(filter);
    e.preventDefault();
})

function filterProducts(pattern) {
    productArray.forEach((product, index) => {
        if (product.name.toUpperCase().includes(pattern)) {
            document.getElementById(index).setAttribute('class', '')
        } else {
            document.getElementById(index).setAttribute('class', 'd-none')
        }
    });
}

document.getElementById('sortByName').addEventListener('click', (e) => {
    e.target.textContent = toggleIcon(e.target.textContent);
    if (e.target.textContent == triangleDownIcon) {
        productArray.sort((a, b) => a.name > b.name ? 1 : -1)
    } else {
        productArray.sort((a, b) => a.name < b.name ? 1 : -1)
    }
    redrawTableBody();
    filterProducts(filter);
    e.preventDefault();
})

document.getElementById('sortPrices').addEventListener('click', (e) => {
    e.target.textContent = toggleIcon(e.target.textContent);
    if (e.target.textContent == triangleDownIcon) {
        productArray.sort((a, b) => a.price - b.price);
    } else {
        productArray.sort((a, b) => b.price - a.price);
    }
    redrawTableBody();
    filterProducts(filter);
    e.preventDefault();
})

function toggleIcon(icon) {
    return (icon == triangleUpIcon) ? triangleDownIcon : triangleUpIcon
}

document.getElementById('inputName').addEventListener('blur', () => {
    const name = document.getElementById('inputName').value;
    let invalidMessage = '';
    if (name.length == 0) {
        invalidMessage = 'Имя не может быть пустым';
    } else if (!name.replace(/\s/g, '').length) {
        invalidMessage = 'Имя не может состоять исключительно из пробелов';
    } else if (name.length > 15) {
        invalidMessage = 'Имя не может быть более 15 символов';
    }
    if (invalidMessage != '') {
        document.getElementById('name-invalid-feedback').textContent = invalidMessage;
        document.getElementById('inputName').classList.add("is-invalid");
    } else {
        document.getElementById('inputName').classList.remove("is-invalid");
    }
})

document.getElementById('inputCount').addEventListener('blur', () => {
    const count = document.getElementById('inputCount').value;
    if (parseFloat(count) < 0) {
        document.getElementById('inputCount').classList.add("is-invalid");      
    } else {
        document.getElementById('inputCount').classList.remove("is-invalid");
    }
})

document.getElementById('inputPrice').addEventListener('blur', () => {
    let price = document.getElementById('inputPrice').value;
    price = price.replace(/\$|,/g, "");
    if (parseFloat(price) < 0) {
        document.getElementById('inputPrice').classList.add("is-invalid");      
    } else {
        document.getElementById('inputPrice').classList.remove("is-invalid");
    }
    document.getElementById('inputPrice').value = formatCurrency(price);
})