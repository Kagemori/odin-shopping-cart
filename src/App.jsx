import { StrictMode, useEffect } from 'react'
import { useState } from 'react'
import styles from './App.module.css'
import logo from './img/logo.png'

import Homepage from "./pages/Homepage"
import Shop from './pages/Shop'
import Checkout from './pages/Checkout'

const App = () => {
  const [cart, setCart] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerted, setAlerted] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [cartWindow, setCartWindow] = useState(false);
  const [route, setRoute] = useState(window.location.pathname);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let response = await fetch('https://fakestoreapi.com/products');
        if(!response.ok){
          throw new Error(`HTTP Error: Status ${response.status}`);
        }
        let result = await response.json();
        result.map((item) => item.priceStr = formatPrice(item.price));
        setData(result);
        setError(null);
      } catch (error) {
        setError(error.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    window.onpopstate = () => setRoute(window.location.pathname);
  }, []);

  function handleAlert(value) {
    const opposite = !alerted;
    setAlerted(prev => !prev);
    if(opposite === true) {
      setAlertMsg(value);
    }

    setTimeout(() => {
      setAlerted(false);
      setAlertMsg(null);
    }, 3000);
  }

  function formatPrice(price) {
    let str = price.toString();
    let arr = str.split("");
    let newPrice = '';
    if(arr.includes(".")){
      let count = 0;
      let decimal = "";
      let i = arr.indexOf(".") + 1;
      for(i; i!==arr.length; i++) {
        count = count + 1;
        decimal = decimal + arr[i];
      }
      if(count === 1){
        decimal = decimal + "0";
        let decArr = decimal.split("");
        arr.pop();
        newPrice = [...arr, ...decArr].join("");
        return newPrice;
      }
      else if(count > 2){
        let newArr = decimal.split("");
        newArr = newArr.splice(0,2);
        let priceArr = arr.slice(0, (arr.indexOf(".")+1));
        newPrice = [...priceArr, ...newArr].join("");
        console.log(newPrice);
        return newPrice;
      }
    } else {
      let zeroArr = [".", "0", "0"];
      newPrice = [...arr, ...zeroArr].join("");
      return newPrice;
    }
    newPrice = arr.join("");
    return newPrice;
  }

  function addItemToCart(e, product) {
    e.preventDefault();
    let updated = [...cart];
    let itemInCart = updated.find((item) => item.id === product.id);

    if(itemInCart) {
      let item = updated[updated.indexOf(itemInCart)];
      if(item.quantity === 10) {
        return 'limited';
      }
      let newQty = item.quantity + 1;
      let newPrice = newQty * item.price;
      let newPriceStr = formatPrice(newPrice);
      updated[updated.indexOf(itemInCart)] = {
        ...item,
        quantity: newQty,
        priceQty: newPrice,
        priceStr: newPriceStr
      };loadCartNum
      setCart(updated);
    } else {
      product = {...product, quantity: 1};
      updated = [...updated, product];
      setCart(updated);
    }
    handleAlert("Added to cart!");
  }

  function removeItemFromCart(e, index) {
    e.preventDefault();
    let updated = [...cart];
    updated = updated.filter((_, itemIndex) => {
      return index !== itemIndex;
    });
    setCart(updated);
  }

  function calculateTotalCart(cart) {
    let items = [...cart];
    let itemPrices = [];
    items.map((item) => {
      if(!item.priceQty) {
        console.log("none");
        itemPrices.push(item.price);
      } else {
        itemPrices.push(item.priceQty);
      }
    });

    let totalPrice = itemPrices.reduce((sum, itemPrice) => {
      return sum + itemPrice;
    }, 0)
    let total = formatPrice(totalPrice);
    return total;
  }

  function calculateTotalItems(cart){
    let items = [...cart];
    let itemQuantities = [];
    items.map((item) => {
      itemQuantities.push(item.quantity);
    });
    let totalQuantity = itemQuantities.reduce((sum, quantity) => {
      return sum + quantity;
    }, 0);
    return totalQuantity;
  }

  function setItemQuantity(value, index){
    if(value === 0 || value == '') {
      return;
    }
    let qty = value;
    let updated = [...cart];
    let newPrice = qty * updated[index].price;
    let newPriceStr = formatPrice(newPrice);
    let item = {
      ...updated[index],
      quantity: qty,
      priceQty: newPrice,
      priceStr: newPriceStr
    }
    updated[index] = item;
    setCart(updated);
  }

  function handleCartWindow() {
    setCartWindow(prev => !prev)
  }

  function loadCartNum() {
    const hasItem = cart.length >= 1;
    const showBubble = hasItem ? styles.visible : '';
    return (
      <p className={`${styles.cartNumber} ${showBubble}`}>{calculateTotalItems(cart)}</p>
    )
  }

  function Cart(arr) {
    if(arr.length > 0){
      return (
        <>
          {arr.map((item, index) => {
            return (
              <div key={index} className={styles.cartItem}>
                <div className={styles.cartItemIcon}>
                  <img src={item.image} alt={item.title} />
                </div>
                <div className={styles.cartItemInfo}>
                  <h4>{item.title}</h4>
                  <span className={styles.itemDetails}>
                    <button onClick={(e) => removeItemFromCart(e, index)}>Remove</button>
                    <label>
                      Qty:
                      <select value={item.quantity} onChange={(e) => setItemQuantity(Number(e.target.value), index)}>
                        {Array.from({length:10}, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </label>
                  </span>
                </div>
                <div className={styles.cartItemMisc}>
                  <p>${item.priceStr}</p>
                </div>
              </div>
            )
          })}
        </>
      )
    } else {
      return (
        <>
        <p>Your cart is empty!</p>
        </>
      )
    }
  }

  const context = {
    data,
    addItemToCart,
    cart,
    setCart,
    setItemQuantity,
    calculateTotalCart,
    removeItemFromCart,
    handleAlert,
    setRoute,
  };

  const renderRoute = () => {
    switch (route) {
      case '/':
        return <Homepage {...context} />;
      case '/shop':
        return <Shop {...context} />;
      case '/checkout':
        return <Checkout {...context} />;
      default:
        return <ErrorPage />;
    }
  };

  return (
    <>
    <div className={`${styles.alertScreen} ${alerted === true ? styles.visible : ''}`}>
      <div className={styles.alert}>
        <p>{alertMsg}</p>
      </div>
    </div>

    <section className={styles.navbar}>
      <div className={styles.shopLogo}>
        <a href="/" id={styles.logoLink} onClick={(e) => {e.preventDefault(); navigate('/');}}>
          <img src={logo} alt="spicy shop" id={styles.logo}/>
        </a>
      </div>

      <nav>
        <a href="/" onClick={(e) => {e.preventDefault(); navigate('/');}}>
          <button>Home</button>
        </a>
        <a href="/shop" onClick={(e) => {e.preventDefault(); navigate('/shop');}}>
          <button>Shop</button>
        </a>
        <button onClick={() => alert("Section in progress!")}>About</button>
      </nav>

      <div className={styles.shopCart}>
        <div onClick={handleCartWindow} className={styles.sectionTop}>
          <svg fill='#000000' version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width="48px" height="48px" viewBox='0 0 902.86 902.86' xmlSpace='preserve'><g id='SVGRepo_bgCarrier' strokeWidth='0'/><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'/><g id='SVGRepo_iconCarrier'><g><g><path d='M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z'/><path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"/></g></g></g></svg>
          {loadCartNum()}
        </div>
        <div className={`${styles.cartWrapper} ${cartWindow === true ? styles.visible : ''}`}>
          <div className={styles.cartDropdown}>
            <h3>Your cart:</h3>
            <div className={styles.cartContent}>
              {Cart(cart)}
            </div>
            <div className={styles.cartBottom}>
              <p>Total: ${calculateTotalCart(cart)}</p>
              <a href="/checkout" onClick={(e) => {e.preventDefault(); handleCartWindow(); navigate('/checkout')}}>View Cart</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    {loading === false ? (renderRoute()
      ) : (
        <div className='loadingScreen'>
          <div className='loader'></div>
        </div>
      )}
    </>
  )
}

export default App
