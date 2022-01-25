import React, {useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QuantitySelector from '../QuantitySelector';

import {DataStore} from '@aws-amplify/datastore';
import {CartProduct} from '../../models';

// interfaces
interface CartProductItemProps {
  cartItem: CartProduct;
}

const CartProductItem = ({cartItem}: CartProductItemProps) => {
  const {product, ...cartProduct} = cartItem;

  // const [quantity, setQuantity] = useState(quantityProp);

  const updateQuantity = async (newQuantity: number) => {
    const original = await DataStore.query(CartProduct, cartProduct.id);

    await DataStore.save(
      CartProduct.copyOf(original, updated => {
        updated.quantity = newQuantity;
      }),
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={{
            uri: product?.image,
          }}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {product?.title}
          </Text>
          {/* Ratings */}
          <View style={styles.ratingContainer}>
            {[...Array(5).keys()].map((key, index) => (
              <FontAwesome
                key={`${product?.id}-${key}`}
                style={styles.star}
                name={
                  index < Math.floor(product?.avgRating)
                    ? 'star'
                    : product?.avgRating - index > 0.5
                    ? 'star-half-full'
                    : 'star-o'
                }
                size={18}
                color={'#e47911'}
              />
            ))}
            <Text>{product?.ratings}</Text>
          </View>
          <Text style={styles.price}>
            from ${product?.price.toFixed(2)}
            {product?.oldPrice && (
              <Text style={styles.oldPrice}>
                {' '}
                ${product.oldPrice.toFixed(2)}
              </Text>
            )}
          </Text>
        </View>
      </View>
      <View style={styles.quantityContainer}>
        <QuantitySelector
          quantity={cartProduct.quantity}
          setQuantity={updateQuantity}
        />
      </View>
    </View>
  );
};

export default CartProductItem;

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
  root: {
    backgroundColor: 'white',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    elevation: 0,
    borderRadius: 10,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    flex: 2,
    height: 150,
    resizeMode: 'contain',
  },
  rightContainer: {
    padding: 10,
    flex: 3,
  },
  title: {
    fontSize: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  star: {
    margin: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    margin: 5,
  },
});
