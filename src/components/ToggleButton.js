/* eslint-disable react/prop-types */
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Colors from '../utils/Colors'

const ToggleButton = ({
  label = 'toggle-btn',
  isToggled = false,
  onTogglePressed = () => {},
}) => {
  return (
    <TouchableOpacity
      onPress={onTogglePressed}
      style={{
        minWidth: 120,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isToggled ? '#fa8072A6' : 'salmon',
        borderRadius: 5,
      }}>
      <Text
        style={{
          opacity: isToggled ? 0.8 : 1,
          color: Colors.light,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default ToggleButton
