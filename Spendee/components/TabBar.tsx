import { Text } from '@/components/ui/text'
import useThemeColor from '@/theme/useThemeColor'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import {
  Banknote,
  Clock,
  Home,
  LucideIcon,
  PiggyBank,
  User,
} from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import React from 'react'
import { Pressable } from 'react-native'

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const icons: Record<string, LucideIcon> = {
    index: Home,
    'profile/index': User,
    movements: Clock,
    piggy: PiggyBank,
    'fixed-expenses': Banknote,
  }
  const { colorHex } = useThemeColor()
  return (
    <BlurView
      experimentalBlurMethod="dimezisBlurView"
      className=" flex-row absolute justify-between items-center border-[0.2px] border-black bottom-0 overflow-hidden rounded-[30px] py-[13px] m-10"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <Pressable
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 justify-center items-center"
          >
            {React.createElement(icons[route.name], {
              color: isFocused
                ? colorHex
                : useColorScheme().colorScheme === 'dark'
                  ? 'white'
                  : 'gray',
            })}
            <Text
              numberOfLines={1}
              style={{ color: isFocused ? colorHex : 'gray' }}
            >
              {label.toString()}
            </Text>
          </Pressable>
        )
      })}
    </BlurView>
  )
}
