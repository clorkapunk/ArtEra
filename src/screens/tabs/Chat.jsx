import React, { memo, useEffect, useState } from "react";
import { Button, ScrollView, Text, TouchableNativeFeedback, View, Image } from "react-native";

const Group = ({item, onPress}) => {
  return (
    <Button
      onPress={onPress}
      buttonStyle={{
        backgroundColor: '#0b132b',
        borderColor: '#5bc0be',
        borderWidth: 2,
        paddingHorizontal: 15
      }}
      type="solid"
      titleStyle={{
        color: '#5bc0be'
      }}
      containerStyle={{
        flex: 1,
        marginHorizontal: 10,
        marginLeft: 0,
      }}
      title={item}/>
  )
}

const Message = ({item}) => {
  return (
    <TouchableNativeFeedback>
      <View className='flex-row justify-between p-4 border-t mb-3'>


        <View className={'mr-2 flex-1'}>
          <Text className='text-2xl'>{item.name}</Text>
          <Text className='text-lg text-gray-600 flex-wrap flex-1'>{item.message}</Text>
        </View>
        <Image
          className='rounded-full'
          style={{width: '20%', aspectRatio: 1}}
          source={{uri: item.img}}
          resizeMode={'cover'}
        />

      </View>
    </TouchableNativeFeedback>
  )
}

const Chat = () => {





  const groups = ["Friends", "Team", "Work"]
  const [tab, setTab] = useState(groups[0])

  const names = ["Sam", 'Rick', "Vlad", 'Goldy', 'Famusta', 'Fakinga']
  const messages = ["Hello buddy",
    'You are fired!',
    'Sounds fun! Let\'s meet up in an hour!',
    'I have plans, can we reschedule?',
    'Can we meet up today?'
  ]
  const avatars = [
    'https://toppng.com/uploads/preview/free-png-happy-black-person-png-images-transparent-black-man-thumbs-up-11563648491mkncpzrjrf.png',
    'https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg',
    'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg',
    'https://t3.ftcdn.net/jpg/03/02/88/46/360_F_302884605_actpipOdPOQHDTnFtp4zg4RtlWzhOASp.jpg',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  ]

  function generateChats() {
    let data = []
    for (let i = 0; i < 10; i++) {
      data.push({
        id: i,
        img: avatars[Math.floor(Math.random() * avatars.length)],
        name: names[Math.floor(Math.random() * names.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      })
    }
    return data
  }

  let [chats, setChats] = useState({
    "Friends": [],
    "Team": [],
    "Work": []
  })

  useEffect(() => {
    setChats({
      "Friends": generateChats(),
      "Team": generateChats(),
      "Work": generateChats()
    })
  }, [])





  return (
    <View className='flex-1'>
      <View className='ml-3 mb-2 mt-2'>
        <ScrollView horizontal={true} className='p-2'>
          {
            groups.map(item => {
              return <Group key={item} item={item} onPress={() => {
                setTab(item)
              }}/>
            })
          }
        </ScrollView>
      </View>
      <View className='mx-3 flex-1'>
        <ScrollView className='flex-1'>
          {
            chats[tab].map(item => {
              return <Message key={item.id} item={item}/>
            })
          }
        </ScrollView>
      </View>
    </View>
  );
}

export default memo(Chat);
