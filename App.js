/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react'
import {
  StatusBar,
  useColorScheme,
  ActivityIndicator,
  NativeModules,
  DeviceEventEmitter,
  View,
  Text,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ToggleButton from './src/components/ToggleButton'
import Colors from './src/utils/Colors'
import { useEffectExceptOnMount } from './src/utils/useEffectExceptOnMount'

const { CardReaderModule } = NativeModules

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const [cardInfo, setcardInfo] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  useEffectExceptOnMount(() => {
    isScanning ? startScann() : stopScan()
  }, [isScanning])

  const onTagRead = cardInfo => {
    setcardInfo(cardInfo)
    CardReaderModule.Toastshow('Card Detected', CardReaderModule.SHORT)
  }

  const startScann = () => {
    CardReaderModule.startScan()
    DeviceEventEmitter.addListener('onReadTag', e => {
      console.log(e)
      onTagRead(e)
    })
  }

  const stopScan = () => {
    CardReaderModule.stopScan()
    DeviceEventEmitter.removeAllListeners()
  }

  const backgroundStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? Colors.darker : Colors.light,
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <View
        style={{
          flexGrow: 1,
          width: '100%',
          alignItems: 'center',
        }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {isScanning && <ActivityIndicator size={'large'} />}
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ToggleButton
            label={isScanning ? 'Scanning...' : 'Press to Scan'}
            isToggled={isScanning}
            onTogglePressed={() => setIsScanning(prevState => !prevState)}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}>
        <View style={{ width: '50%' }}>
          <Text>iDm:</Text>
          <Text>{(cardInfo && cardInfo.idm) || ''}</Text>
          <Text>Manufacturer:</Text>
          <Text>{(cardInfo && cardInfo.manufacturer) || ''}</Text>
          <Text>isWaon:</Text>
          <Text>
            {(cardInfo && (cardInfo.isWaon ? 'true' : 'false')) || ''}
          </Text>
          {cardInfo && cardInfo.isWaon && (
            <>
              <Text>Waon Number:</Text>
              <Text>{cardInfo.waonNumber || ''}</Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar
    //     translucent={true}
    //     backgroundColor={'transparent'}
    //     barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    //   />
    //   {isScanning && <ActivityIndicator style={{ top: -100 }} size={'large'} />}
    //   <ToggleButton
    //     label={isScanning ? 'Scanning...' : 'Press to Scan'}
    //     isToggled={isScanning}
    //     onTogglePressed={() => setIsScanning(prevState => !prevState)}
    //   />
    // </SafeAreaView>
  )
}

export default App
