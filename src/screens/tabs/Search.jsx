import React, {memo, useContext, useEffect, useState} from "react";
import {
    View,
    Text,
    ScrollView,
    InteractionManager,
    ActivityIndicator,
    RefreshControl,
    ToastAndroid, TouchableOpacity
} from "react-native";
import GridItem from "../../components/GridItem";
import {getPostsBySearch} from "../../api/ContentAPI";
import MasonryList from '@react-native-seoul/masonry-list';
import ErrorScreens from "../../components/ErrorScreens";
import SearchBar from '../../components/SearchBar'
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faSearch, faX} from "@fortawesome/free-solid-svg-icons";
import {s} from 'react-native-wind'
import LinearGradient from "react-native-linear-gradient";
import {SafeAreaView} from "react-native-safe-area-context";
import SkeletonView from "../../components/SkeletonView";
import ThemeContext from "../../context/ThemeProvider";


const CustomLinearGradient = () =>
    <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.5)',  "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{flex: 1}}
    />


const SearchTag = ({item}) => {
    return (
        <View className="bg-white mr-2 px-2 py-1 rounded-full border">
            <Text>
                {item}
            </Text>
        </View>
    );
};

const Search = memo(() => {
    const {colors} = useContext(ThemeContext)
    const [data, setData] = useState({
        count: null,
        next: null,
        previous: null,
        results: []
    });
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const timeout = React.useRef(null);
    const [isContentLoaded, setIsContentLoaded] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });

        setIsContentLoaded(false)
        getPostsBySearch('', '', 1)
            .then(data => {
                setData(data)
                setIsContentLoaded(true)
            })
            .catch(e => {
                setIsContentLoaded(true)
                setIsNetworkError(true)
            })
    }, []);

    useEffect(() => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            onSearch()
        }, 2000);
    }, [search])

    const onChangeSearch = (value) => {
        setSearch(value);

    }

    function onSearch() {
        setIsNetworkError(false)
        setIsContentLoaded(false)
        getPostsBySearch(search, '', 1)
            .then(data => {
                setData(data)
                setTimeout(() => {
                    setIsContentLoaded(true)
                }, 1000)
            })
            .catch(e => {
                setIsContentLoaded(true)
                setIsNetworkError(true)
            })
    }

    const onRefresh = () => {
        setData({
            count: null,
            next: null,
            previous: null,
            results: []
        })
        setIsNetworkError(false);
        setIsContentLoaded(false)
        getPostsBySearch(search, '', 1)
            .then(data => {
                setData(data);
                setTimeout(() => {
                    setIsContentLoaded(true)
                }, 1000)
            })
            .catch((e) => {
                setIsNetworkError(true);
                setIsContentLoaded(true)
            });
    }

    const onEndReached = () => {
        if (data.next === null) {
            ToastAndroid.show("End reached!", ToastAndroid.SHORT)
            return
        }

        getPostsBySearch(search, '', data.next)
            .then(data => {
                setData(prevState => {
                    return {
                        next: data.next,
                        previous: data.previous,
                        count: data.count,
                        results: prevState.results.concat(data.results)
                    }
                });
            })
            .catch((e) => {
                setIsNetworkError(true)
            });
    }

    function onClear() {
        setSearch('')
        setIsContentLoaded(false)
        getPostsBySearch('', '', 1)
            .then(data => {
                setData(data)
                setTimeout(() => {
                    setIsContentLoaded(true)
                }, 1000)
            })
            .catch(e => {
                setIsContentLoaded(true)
                setIsNetworkError(true)
            })
    }

    function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    const componentLoaded = () => {
        if (isLoading) return (
            <ErrorScreens type={'loading'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        if (isNetworkError) return (
            <View style={{marginVertical: 200}}>
                <ErrorScreens
                    type={'network'}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            </View>
        )

        if (!isContentLoaded) return (
            <View className='flex-row px-2 justify-between mb-2'>
                <View className='flex-col' style={{width: '49.5%'}}>
                    <SkeletonView
                        style={[s``, {flex: 1, borderRadius: 0, height: 200,}]}
                    />
                    <View className={'mb-1'}/>
                    <SkeletonView
                        style={[s``, {flex: 1, borderRadius: 0, height: 300,
                           }]}
                    />
                    <View className={'mb-1'}/>
                    <SkeletonView
                        style={[s``, {flex: 1, borderRadius: 0, height: 300}]}
                    />
                </View>
                <View className='flex-col' style={{width: '49.5%'}}>
                    <SkeletonView
                        style={[s``, {flex: 1, borderRadius: 0, height: 300}]}
                    />
                    <View className={'mb-1'}/>
                    <SkeletonView
                        style={[s``, {flex: 1, borderRadius: 0, height: 200}]}
                    />
                </View>
            </View>
        )

        return true
    }


    return (
        <View style={{backgroundColor: colors.background}}>
            {

                <ScrollView
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent) && isContentLoaded) {
                            onEndReached()
                        }
                    }}
                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
                    refreshControl={
                        <RefreshControl
                            enabled={true}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <SafeAreaView>
                        <View
                            style={{backgroundColor: colors.background}}
                            className='px-2 py-3'>
                            <SearchBar
                                onSubmitEditing={() => onSearch()}
                                placeholder={'Tap to explore'}
                                onChangeText={(value) => onChangeSearch(value)}
                                value={search}
                                rightIcon={
                                    <TouchableOpacity onPress={() => onSearch()}>
                                        <View>
                                            <FontAwesomeIcon
                                                color={colors.main}
                                                size={20}
                                                icon={faSearch}/>
                                        </View>
                                    </TouchableOpacity>
                                }
                                clearIcon={
                                    <TouchableOpacity
                                        className='p-2'
                                        onPress={() => onClear()}>
                                        <View>
                                            <FontAwesomeIcon
                                                color={colors.main}
                                                icon={faX}
                                                size={15}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                }
                                clearIconStyle={{
                                    ...s`px-1`
                                }}
                                labelStyle={{}}
                                errorStyle={{}}
                                containerStyle={{...s``}}
                                placeholderTextColor={colors.placeholder}
                                inputContainerStyle={{
                                    ...s`border rounded-xl`,
                                    borderColor: colors.main
                                }}
                                inputStyle={{
                                    textAlign: 'center',
                                    fontFamily: 'AveriaSerifLibre_Regular',
                                    color: colors.main,
                                    ...s`text-xl py-1 ml-2`
                                }}
                                iconContainerStyle={{...s`p-2`}}
                                textInputProps={{}}
                            />
                        </View>
                    </SafeAreaView>

                    {
                        componentLoaded() !== true ?
                            componentLoaded()
                            :
                            <View className="flex-1 px-1">
                                {
                                    data.results.length === 0 ?
                                        <View>
                                            <Text
                                                style={{color: colors.main}}
                                                className='text-xl text-center mt-5 font-averia_r'
                                            >Nothing here but us</Text>
                                        </View>
                                        :
                                        <MasonryList
                                            refreshControl={
                                                <RefreshControl
                                                    enabled={true}
                                                    refreshing={refreshing}
                                                    onRefresh={onRefresh}
                                                />
                                            }
                                            onEndReached={() => onEndReached()}
                                            columnWrapperStyle={{
                                                justifyContent: "space-between",
                                            }}
                                            numColumns={2}
                                            data={data.results}
                                            renderItem={({item}) => (<GridItem item={item}/>)}
                                            keyExtractor={(item) => item.id}
                                        />
                                }
                            </View>
                    }
                </ScrollView>

            }
        </View>

    );
});

export default memo(Search);
