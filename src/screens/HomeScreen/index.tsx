import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, SafeAreaView} from 'react-native';
import ProductItem from '../../components/ProductItem';
import {DataStore} from '@aws-amplify/datastore';
import {Product, CartProduct} from '../../models';

// import products from '../../data/products';

const HomeScreen = ({searchValue}: {searchValue: string}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    DataStore.query(Product).then(setProducts); // just pass the function <- the same as "results => setProducts(results)"
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      {/* Render Product Component */}
      <FlatList
        data={products}
        renderItem={({item}) => <ProductItem item={item} />}
        keyExtractor={({id}) => id}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
});
