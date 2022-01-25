import React, {useCallback, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
} from 'react-native';

const ImageCarousel = ({images}: {images: string[]}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const windowWidth = useWindowDimensions().width;

  // avoid invariant violation error with useRef
  // https://stackoverflow.com/questions/65256340/keep-getting-changing-onviewableitemschanged-on-the-fly-is-not-supported
  const viewabilityConfig = useRef({
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 50, // make only one item visible
    minimumViewTime: 300,
  });

  // avoid error with React indication
  // https://stackoverflow.com/questions/64089808/react-native-flatlist-onviewableitemschanged-callback-encounter-error-after-stat
  const onViewableItemsChanged = React.useRef(({viewableItems}) => {
    console.log(viewableItems);
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  return (
    <View style={styles.root}>
      <FlatList
        data={images}
        renderItem={({item, index}) => (
          <Image
            key={index}
            style={[styles.image, {width: windowWidth - 40}]}
            source={{uri: item}}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth - 20}
        snapToAlignment={'center'}
        decelerationRate={'fast'}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />

      <View style={styles.dots}>
        {images.map((image, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {backgroundColor: index === activeIndex ? '#c9c9c9' : '#e0e0e0'},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  root: {},
  image: {
    margin: 10,
    height: 250,
    resizeMode: 'contain',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: '#e0e0e0',
    borderColor: '#c9c9c9',
    margin: 5,
  },
});
