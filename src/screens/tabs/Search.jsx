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
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });

        setIsSearchLoading(true)
        getPostsBySearch('', '', 1)
            .then(data => {
                setIsSearchLoading(false)
                setData(data)
            })
            .catch(e => {
                setIsSearchLoading(false)
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
        setIsSearchLoading(true)
        getPostsBySearch(search, '', 1)
            .then(data => {
                setData(data)
                setIsSearchLoading(false)
            })
            .catch(e => {
                setIsSearchLoading(false)
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
        setRefreshing(true);
        setIsNetworkError(false);
        setIsSearchLoading(true)
        getPostsBySearch(search, '', 1)
            .then(data => {
                setData(data);
                setRefreshing(false);
                setIsSearchLoading(false)
            })
            .catch((e) => {
                setRefreshing(false);
                setIsNetworkError(true);
                setIsSearchLoading(false)
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
        setIsSearchLoading(true)
        getPostsBySearch('', '', 1)
            .then(data => {
                setData(data)
                setIsSearchLoading(false)
            })
            .catch(e => {
                setIsSearchLoading(false)
                setIsNetworkError(true)
            })
    }

    const componentLoaded = () => {
        if (isLoading) return (
            <View>
                <ActivityIndicator/>
            </View>
        )

        if (isNetworkError) return (
            <ErrorScreens type={'network'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        return true
    }


    return (
        <>
            {
                componentLoaded() !== true ?
                    componentLoaded()
                    :
                    <View className={"flex-col flex-1"}>
                        <View className={"mx-5 my-4"}>
                            <SearchBar
                                onSubmitEditing={() => onSearch()}
                                placeholder={''}
                                onChangeText={(value) => onChangeSearch(value)}
                                value={search}
                                rightIcon={
                                    <TouchableOpacity onPress={() => onSearch()}>
                                        <View>
                                            <FontAwesomeIcon size={20} icon={faSearch}/>
                                        </View>
                                    </TouchableOpacity>
                                }
                                clearIcon={
                                    <TouchableOpacity
                                        className='p-2'
                                        onPress={() => onClear()}>
                                        <View>
                                            <FontAwesomeIcon icon={faX} size={15}/>
                                        </View>
                                    </TouchableOpacity>
                                }
                                clearIconStyle={{}}
                                labelStyle={{}}
                                errorStyle={{}}
                                containerStyle={{}}
                                inputContainerStyle={{}}
                                inputStyle={{}}
                                iconContainerStyle={{}}
                            />
                        </View>
                        <View className="ml-3 mb-4">
                            <ScrollView horizontal={true}>
                                {
                                    tags.map(item => {
                                        return <SearchTag key={item} item={item}/>;
                                    })
                                }
                            </ScrollView>
                        </View>
                        <View className="flex-1 px-1">
                            {
                                isSearchLoading ?
                                    <ActivityIndicator size={30} className='mb-2'/>
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
                    </View>

            }
        </>

    );
});

export default memo(Search);
