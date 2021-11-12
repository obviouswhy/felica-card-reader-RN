/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react'
import { Button, StatusBar, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from './src/utils/Colors'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <Button onPress={() => alert()} title={'Scan'} />
    </SafeAreaView>
  )
}

export default App
