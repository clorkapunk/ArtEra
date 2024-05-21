import React from 'react';
import LinearGradient from "react-native-linear-gradient";
import {Skeleton} from "@rneui/themed";


const CustomLinearGradient = () =>
    <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.5)', "transparent"]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={{flex: 1}}
    />

const SkeletonView = ({
                          skeletonStyle,
                          animation,
                          style,
                          circle
                      }) => {
    return (
        <Skeleton
            circle={circle}
            LinearGradientComponent={CustomLinearGradient}
            skeletonStyle={skeletonStyle}
            animation={'wave'}
            style={[style,{ opacity: 0.5 }]}
        />
    );
};

export default SkeletonView;
