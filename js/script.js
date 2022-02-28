const cartFunc = () => {
    const cartBtn = document.querySelector('.button-cart');
    const cart = document.getElementById('modal-cart');
    const closeBtn = cart.querySelector('.modal-close');
    const goodsContainer = document.querySelector('.long-goods-list');
    const cartTable = document.querySelector('.cart-table__goods');
    const modalForm = document.querySelector('.modal-form');
    const totalPrice = document.querySelector('.card-table__total');


    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.filter(good => {
            return good.id != id;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    }

    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if (good.id == id) {
                good.count++;
            }
            return good;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    }

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if (good.id == id) {
                if (good.count > 0) {
                    good.count--;
                }
            }
            return good;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));
        renderCartGoods(JSON.parse(localStorage.getItem('cart')));
    }

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'))
        const clickedGood = goods.find(good => good.id == id);
        const cart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        if (cart.some(good => good.id == clickedGood.id)) {
            cart.map(good => {
                if (good.id == clickedGood.id) {
                    good.count++;
                }
                return good;
            })
        } else {
            clickedGood.count = 1;
            cart.push(clickedGood);
        }

        localStorage.setItem('cart', JSON.stringify(cart))
    }

    const renderCartGoods = (goods) => {
        cartTable.innerHTML = '';
        goods.forEach(good => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}$</td>
                <td><button class="cart-btn-minus"">-</button></td>
                <td>${good.count}</td>
                <td><button class=" cart-btn-plus"">+</button></td>
                <td class = "good-price">${+good.price * good.count}$</td>
                <td><button class="cart-btn-delete"">x</button></td>
            `

            cartTable.append(tr);

            tr.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(good.id);
                } else if (e.target.classList.contains('cart-btn-plus')) {
                    plusCartItem(good.id);
                } else if (e.target.classList.contains('cart-btn-delete')) {
                    deleteCartItem(good.id);
                }
            })
        })
        const goodTotalPrice = document.querySelectorAll('.good-price');
        let sum = 0;
        goodTotalPrice.forEach((eachPrice) => {
            let price = eachPrice.textContent;
            let subPrice = price.slice(0, -1)
            sum += +subPrice;
        })

        totalPrice.innerHTML = `${sum}$`
    }

    const nameForm = modalForm.elements.nameCustomer;
    const phoneForm = modalForm.elements.phoneCustomer;

    const sendForm = () => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartArray,
                name: nameForm.value,
                phone: phoneForm.value,
            })
        }).then(() => {
            cart.style.display = '';
            localStorage.removeItem('cart');
        })
    }

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendForm();
    })

    cartBtn.addEventListener('click', () => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : [];

        renderCartGoods(cartArray);
        cart.style.display = 'flex';
    })

    closeBtn.addEventListener('click', () => {
        cart.style.display = '';
    })

    cart.addEventListener('click', (event) => {
        if (!event.target.closest('.modal') && event.target.classList.contains('overlay')) {
            cart.style.display = '';
        }
    })

    window.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            cart.style.display = '';
        }
    })

    if (goodsContainer) {
        goodsContainer.addEventListener('click', (event) => {
            if (event.target.closest('.add-to-cart')) {
                const buttonToCart = event.target.closest('.add-to-cart');
                const goodId = buttonToCart.dataset.id;

                addToCart(goodId);
            }
        })
    }

    const btnAdd = document.querySelectorAll('.add-to-cart');
    btnAdd.forEach(btn => {
        btn.addEventListener('click', () => {
            const goodId = btn.dataset.id;
    
            addToCart(goodId);
        })
    })

}
cartFunc();

const searchFunc = () => {
    const input = document.querySelector('.search-block > input');
    const searchBtn = document.querySelector('.search-block > button');

    const renderGoods = (goods) => {
        const goodsContainer = document.querySelector('.long-goods-list');

        goodsContainer.innerHTML = '';

        goods.forEach(good => {
            const goodBlock = document.createElement('div');

            goodBlock.classList.add('col-lg-3');
            goodBlock.classList.add('col-sm-6');

            goodBlock.innerHTML = `
                <div class="goods-card">
                    <span class="label ${good.label ? null : 'd-none'}">${good.label}</span>
                    <img src="db/${good.img}" alt="image: ${good.name}" class="goods-image">
                    <h3 class="goods-title">${good.name}</h3>
                    <p class="goods-description">${good.description}</p>
                    <button class="button goods-card-btn add-to-cart" data-id="${good.id}">
                        <span class="button-price">$${good.price}</span>
                    </button>
                </div>
            `

            goodsContainer.append(goodBlock);
        })
    }

    const getData = (value) => {
        fetch('db/db.json')
            .then((response) => response.json())
            .then((data) => {
                const array = data.filter(good => {
                    return good.name.toLowerCase().includes(value.toLowerCase());
                });

                localStorage.setItem('goods', JSON.stringify(array));

                if (window.location.pathname != '/goods.html') {
                    window.location.href = '/goods.html';
                } else {
                    renderGoods(array);
                }
            })
    }

    try {
        searchBtn.addEventListener('click', (e) => {
            getData(input.value);
        })
    } catch (e) {
        console.error(e.message);
    }
}
searchFunc();

const getGoods = () => {
    const links = document.querySelectorAll('.navigation-link');
    const viewAll = document.querySelectorAll('.viewAll');

    const renderGoods = (goods) => {
        const goodsContainer = document.querySelector('.long-goods-list');

        goodsContainer.innerHTML = '';

        goods.forEach(good => {
            const goodBlock = document.createElement('div');

            goodBlock.classList.add('col-lg-3');
            goodBlock.classList.add('col-sm-6');

            goodBlock.innerHTML = `
                <div class="goods-card">
                    <span class="label ${good.label ? null : 'd-none'}">${good.label}</span>
                    <img src="db/${good.img}" alt="image: ${good.name}" class="goods-image">
                    <h3 class="goods-title">${good.name}</h3>
                    <p class="goods-description">${good.description}</p>
                    <button class="button goods-card-btn add-to-cart" data-id="${good.id}">
                        <span class="button-price">$${good.price}</span>
                    </button>
                </div>
            `

            goodsContainer.append(goodBlock);
        })
    }

    const getData = (value, category) => {
        fetch('db/db.json')
            .then((response) => response.json())
            .then((data) => {
                const array = category ? data.filter((item) => item[category] == value) : data;

                localStorage.setItem('goods', JSON.stringify(array));

                if (window.location.pathname != '/goods.html') {
                    window.location.href = '/goods.html';
                } else {
                    renderGoods(array);
                }
            })
    }

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const linkValue = link.textContent;
            const category = link.dataset.field;

            getData(linkValue, category);
        })
    })

    if (localStorage.getItem('goods') && window.location.pathname == '/goods.html') {
        renderGoods(JSON.parse(localStorage.getItem('goods')));
    }

    if (viewAll) {
        viewAll.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();

                getData();
            })
        })
    }
}
getGoods();