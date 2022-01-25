import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import CartProductItem from '../../components/CartProductItem';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';

import {DataStore} from '@aws-amplify/datastore';
import {Auth} from 'aws-amplify';
import {Product, CartProduct} from '../../models';

// import products from '../../data/cart';

const ShoppingCartScreen = () => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  // const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const fetchCartProducts = async () => {
    // setLoading(true);

    // get cart product items of authenticated user only
    const userData = await Auth.currentAuthenticatedUser();

    // TODO query only my cart items
    // https://docs.amplify.aws/lib/datastore/data-access/q/platform/js/#query-data
    DataStore.query(
      CartProduct,
      cp => cp.userSub('eq', userData.attributes.sub), // eq, gt...
    ).then(setCartProducts);
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  useEffect(() => {
    if (cartProducts.filter(cp => !cp.product).length === 0) {
      // setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      // setLoading(true);
      // query all products that are used in cart
      const products = await Promise.all(
        cartProducts.map(cartProduct =>
          DataStore.query(Product, cartProduct.productID),
        ),
      );

      // assign the products to the cart items
      setCartProducts(currentCartProducts =>
        currentCartProducts.map(cartProduct => ({
          ...cartProduct,
          product: products.find(p => p?.id === cartProduct.productID),
        })),
      );
    };

    fetchProducts();
  }, [cartProducts]);

  useEffect(() => {
    const subscription = DataStore.observe(CartProduct).subscribe(msg =>
      fetchCartProducts(),
    );
    return subscription.unsubscribe();
  }, []);

  // real time
  useEffect(() => {
    const subscriptions = cartProducts.map(cartProduct =>
      DataStore.observe(CartProduct, cartProduct.id).subscribe(msg => {
        if (msg.opType === 'UPDATE') {
          setCartProducts(curCartProducts =>
            curCartProducts.map(cp => {
              if (cp.id !== msg.element.id) {
                return cp;
              }
              return {
                ...cp,
                ...msg.element,
              };
            }),
          );
        }
        // console.log(msg.model, msg.opType, msg.element);
      }),
    );

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [cartProducts]);

  const onCheckout = () => {
    navigation.navigate('AddressScreen');
  };

  if (cartProducts.filter(cp => !cp.product).length !== 0) {
    return <ActivityIndicator />;
  }

  const totalPrice = cartProducts.reduce(
    (summedPrice, cartProduct) =>
      summedPrice + (cartProduct.product.price || 0) * cartProduct.quantity,
    0,
  );

  return (
    <SafeAreaView style={styles.page}>
      {/* Render Product Component */}
      <FlatList
        data={cartProducts}
        renderItem={({item}) => <CartProductItem cartItem={item} />}
        keyExtractor={({id}) => id}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <Text style={{fontSize: 18}}>
              Subtotal ({cartProducts.length} items) :
              <Text style={{color: '#e47911', fontWeight: 'bold'}}>
                {' '}
                ${totalPrice.toFixed(2)}
              </Text>
            </Text>
            <Button
              text="Proceed to checkout"
              onPress={onCheckout}
              containerStyles={{
                backgroundColor: '#f7e300',
                borderColor: '#c7b702',
              }}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ShoppingCartScreen;

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
});
