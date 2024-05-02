import React, {memo} from "react";
import { ActivityIndicator, View, Image} from "react-native";

const GridItem = ({item}) => {
  return (
    <View key={item.id} className='flex-col my-3 mx-3' style={{flex: 1, flexGrow: 1}}>
      <Image
        source={{ uri: item.img }}
        style={{width: '100%', flex: 1, aspectRatio: 1}}
        PlaceholderContent={<ActivityIndicator />}
      />
    </View>
  );
};

export default memo(GridItem);
