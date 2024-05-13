import React, {memo, useEffect, useState} from "react";
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
import {Skeleton} from "@rneui/themed";
import {s} from 'react-native-wind'
import LinearGradient from "react-native-linear-gradient";
import {colors} from "../../consts/colors";
import {SafeAreaView} from "react-native-safe-area-context";


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
    const [data, setData] = useState({
        count: null,
        next: null,
        previous: null,
        results: []
    });
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const tags = ["TAG 1", "TAG 2", "TAG 3", "TAG 4", "TAG 5", "TAG 6", "TAG 7", "TAG 8", "TAG 9"];
    const timeout = React.useRef(null);
    const [isContentLoaded, setIsContentLoaded] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const [inputStyle, setInputStyle] = useState()

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

    const onChangeSearch = (value) => {
        clearTimeout(timeout.current);
        setSearch(value);
        timeout.current = setTimeout(() => {
            onSearch()
        }, 2000);
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
            <View>
                <ActivityIndicator/>
            </View>
        )

        if (isNetworkError) return (
            <View style={{marginTop: 200}}>
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
                    <Skeleton
                        animation={'wave'}
                        LinearGradientComponent={LinearGradient}
                        style={[s``, {flex: 1, borderRadius: 0, height: 200}]}
                    />
                    <View className={'mb-1'}/>
                    <Skeleton
                        animation={'wave'}
                        LinearGradientComponent={LinearGradient}
                        style={[s``, {flex: 1, borderRadius: 0, height: 300}]}
                    />
                    <View className={'mb-1'}/>
                    <Skeleton
                        animation={'wave'}
                        LinearGradientComponent={LinearGradient}
                        style={[s``, {flex: 1, borderRadius: 0, height: 300}]}
                    />
                </View>
                <View className='flex-col' style={{width: '49.5%'}}>
                    <Skeleton
                        animation={'wave'}
                        LinearGradientComponent={LinearGradient}
                        style={[s``, {flex: 1, borderRadius: 0, height: 300}]}
                    />
                    <View className={'mb-1'}/>
                    <Skeleton
                        animation={'wave'}
                        LinearGradientComponent={LinearGradient}
                        style={[s``, {flex: 1, borderRadius: 0, height: 200}]}
                    />
                </View>
            </View>
        )

        return true
    }


    return (
        <>
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
                        <View className='px-2 py-3 bg-background'>
                            <SearchBar
                                onSubmitEditing={() => onSearch()}
                                placeholder={'Tap to explore'}
                                onChangeText={(value) => onChangeSearch(value)}
                                value={search}
                                rightIcon={
                                    <TouchableOpacity onPress={() => onSearch()}>
                                        <View>
                                            <FontAwesomeIcon
                                                color={colors.search.icon}
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
                                                color={colors.search.clear}
                                                icon={faX}
                                                size={15}/>
                                        </View>
                                    </TouchableOpacity>
                                }
                                clearIconStyle={{
                                    ...s`px-1`
                                }}
                                labelStyle={{}}
                                errorStyle={{}}
                                containerStyle={{...s``}}
                                placeholderTextColor={colors.search.placeholder}
                                inputContainerStyle={{
                                    ...s`border rounded-xl`,
                                    borderColor: colors.search.border
                                }}
                                inputStyle={{
                                    textAlign: 'center',
                                    fontFamily: 'AveriaSerifLibre_Regular',
                                    color: colors.search.text,
                                    ...s`text-xl py-1 ml-2`
                                }}
                                iconContainerStyle={{...s`p-2`}}
                                textInputProps={{}}
                            />
                        </View>
                    </SafeAreaView>
                    {/*<View className="ml-3 mb-4">*/}
                    {/*    <ScrollView horizontal={true}>*/}
                    {/*        {*/}
                    {/*            tags.map(item => {*/}
                    {/*                return <SearchTag key={item} item={item}/>;*/}
                    {/*            })*/}
                    {/*        }*/}
                    {/*    </ScrollView>*/}
                    {/*</View>*/}

                    {
                        componentLoaded() !== true ?
                            componentLoaded()
                            :
                            <View className="flex-1 px-1">
                                {
                                    data.results.length === 0 ?
                                        <View>
                                            <Text className='text-center mt-5'>Nothing here but us</Text>
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
                                            keyExtractor={(item, index) => item.id}
                                        />
                                }
                            </View>
                    }
                </ScrollView>

            }
        </>

    );
});

export default memo(Search);
