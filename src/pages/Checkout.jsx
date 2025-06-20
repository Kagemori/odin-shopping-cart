import styles from './Checkout.module.css'

function Checkout ({cart, setItemQuantity, calculateTotalCart, removeItemFromCart, handleAlert, setCart, setRoute}) {
    const navigate = (path) => {
        window.history.pushState({}, '', path);
        setRoute(path);
    }

    function loadCart(cart) {
        return (
            <>
            {cart.map((item, index) => {
                return (
                    <div key={index} className={styles.bagItem}>
                        <div className={styles.imgContainer}>
                            <img src={item.image} alt={item.title} />
                         </div>
                         <div className={styles.itemInfo}>
                            <h4 className={styles.itemTitle}>{item.title}</h4>
                            <span>
                                <p className={styles.itemPrice}>${item.priceStr}</p>
                                <label>
                                    Qty:
                                    <select
                                    value={item.quantity}
                                    onChange={(e) => setItemQuantity(Number(e.target.value), index)}
                                    >
                                        {Array.from({length: 10},(_,i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </span>
                         </div>
                         <div className={styles.bagOptions}>
                            <svg onClick={(e) => removeItemFromCart(e,index)} className={styles.removeIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" /></svg>
                         </div>
                    </div>
                )
            })}
            </>
        )
    }

    function submitOrder() {
        if(cart.length < 1) {
            handleAlert("Your cart is empty!");
            return;
        }
        handleAlert("Order submitted!");
        setCart([]);
    }

    return (
        <div className={styles.content}>
            <div className={styles.checkoutContainer}>
                <div className={styles.bag}>
                    <h3>My bag:</h3>
                    <div className={styles.bagList}>
                        {cart.length >= 1 ? loadCart(cart) : <p className={styles.emptyCart}>Your cart is empty... go and <a href="/shop" onClick={(e) => {e.preventDefault(); navigate('/shop');}}>shop!</a></p>}
                    </div>
                </div>
                <div className={styles.options}>
                    <p>Total: ${calculateTotalCart(cart)}</p>
                    <button onClick={submitOrder}>Check Out</button>
                </div>
            </div>
        </div>
    )
}

export default Checkout;