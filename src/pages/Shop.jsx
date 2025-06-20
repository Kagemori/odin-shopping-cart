import { useState } from "react";
import styles from './Shop.module.css'

function Shop({data, addItemToCart}) {
    const [curProducts, setCurProducts] = useState(null);
    const [curSelectedCategory, setSelectedCategory] = useState(null);
    const categorySet = getCateFromData(data);

    function getCateFromData(data) {
        const categories = new Set();
        data.map((item) => {
            categories.add(item.category);
        });
        return [...categories];
    }

    function getProdForCategory(data, index){
        let catProducts = data.filter((item) => {
            return item.category === categorySet[index];
        });
        return catProducts;
    }

    function handleCategoryBtnClick(e, data, index){
        setSelectedCategory(categorySet[index]);
        let products = getProdForCategory(data,index);
        setCurProducts(products);
    }

    return (
        <div className={styles.content}>
            <nav className={styles.categoryNav}>
                {categorySet.map((category, index) => {
                    const isSelected = category === curSelectedCategory;
                    const selectedClass = isSelected ? `${styles.selected}` : null;
                    return <button onClick={(e) => handleCategoryBtnClick(e,data,index)} className={`${styles.categoryBtn} ${selectedClass}`} key={index}>
                        {category}
                    </button>
                })}
            </nav>
            <main className={styles.itemContainer}>
                {curProducts ?
                curProducts.map((product,index) => {
                    return (
                        <div key={index} className={styles.itemCard}>
                            <div className={styles.cardImg}>
                                <img src={product.image} alt={product.title} />
                            </div>
                            <span className={styles.cardInfo}>
                                <h2 className={styles.itemTitle}>{product.title}</h2>
                                <h1 className={styles.itemPrice}>{"$" + product.priceStr}</h1>
                                <span className={styles.cardMisc}>
                                    <button className={styles.addCartBtn} onClick={(e) => {addItemToCart(e,product)}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>cart-plus</title><path d="M11 9H13V6H16V4H13V1H11V4H8V6H11M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18M17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18M7.2 14.8V14.7L8.1 13H15.5C16.2 13 16.9 12.6 17.2 12L21.1 5L19.4 4L15.5 11H8.5L4.3 2H1V4H3L6.6 11.6L5.2 14C5.1 14.3 5 14.6 5 15C5 16.1 5.9 17 7 17H19V15H7.4C7.3 15 7.2 14.9 7.2 14.8Z" /></svg>
                                    </button>
                                    <p className={styles.itemRatings}>{product.rating.rate + " Stars"} | {product.rating.count + " Left"}</p>
                                </span>
                            </span>
                        </div>
                    );
                })
                :
                null
            }
            </main>
        </div>
    )
}

export default Shop;