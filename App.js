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
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ToggleButton from './src/components/ToggleButton'
import Colors from './src/utils/Colors'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const [isScanning, setIsScanning] = useState(false)

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
      {isScanning && <ActivityIndicator style={{ top: -100 }} size={'large'} />}
      <ToggleButton
        label={isScanning ? 'Scanning...' : 'Press to Scan'}
        isToggled={isScanning}
        onTogglePressed={() => setIsScanning(prevState => !prevState)}
      />
    </SafeAreaView>
  )
}

export default App
