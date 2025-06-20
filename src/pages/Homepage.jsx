import styles from './Homepage.module.css';

function Homepage({setRoute}) {
    const navigate = (path) => {
        window.history.pushState({}, '', path);
        setRoute(path);
    }
    return (
        <div className={styles.content}>
            <span className={styles.homepageContent}>
                <svg height="120px" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 24 24"><title>shopping</title><path d="M12,13A5,5 0 0,1 7,8H9A3,3 0 0,0 12,11A3,3 0 0,0 15,8H17A5,5 0 0,1 12,13M12,3A3,3 0 0,1 15,6H9A3,3 0 0,1 12,3M19,6H17A5,5 0 0,0 12,1A5,5 0 0,0 7,6H5C3.89,6 3,6.89 3,8V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V8C21,6.89 20.1,6 19,6Z" /></svg>
                <h1>Welcome to Spicy Shop!</h1>
                <p>Feel the heat with a wide assortment of Spicy merchandise. Get yours today!</p>
                <a href="/shop" onClick={(e) => {e.preventDefault(); navigate('/shop');}}>
                    <button>Shop Now</button>
                </a>
            </span>
        </div>
    )
}

export default Homepage;