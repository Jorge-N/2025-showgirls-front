import { cn } from '@/lib/utils'
import React, { useRef } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native'

interface DayWheelPickerProps {
  selectedDay: number
  onSelectDay: (day: number) => void
}

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const ITEM_HEIGHT = 45

export default function DayWheelPicker({
  selectedDay,
  onSelectDay,
}: DayWheelPickerProps) {
  const flatListRef = useRef<FlatList>(null)

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y
    const index = Math.round(y / ITEM_HEIGHT)
    const day = DAYS[index]

    if (day && day !== selectedDay) {
      onSelectDay(day)
    }
  }

  return (
    <View className="gap-2 items-center w-full py-4">
      <View
        style={{ height: ITEM_HEIGHT * 5 }}
        className="w-full justify-center items-center overflow-hidden"
      >
        <View
          style={{ height: ITEM_HEIGHT, top: ITEM_HEIGHT * 2 }}
          pointerEvents="none"
          className="absolute w-full border-y border-primary/30 bg-primary/5 z-10"
        />

        <FlatList
          className="w-full"
          ref={flatListRef}
          data={DAYS}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={onScroll}
          onScroll={onScroll}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          initialScrollIndex={selectedDay - 1}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={({ item }) => {
            const isSelected = selectedDay === item
            const isNeighbor = Math.abs(selectedDay - item) === 1

            return (
              <View
                style={{ height: ITEM_HEIGHT }}
                className="justify-center items-center w-full"
              >
                <Text
                  className={cn(
                    'transition-all',
                    isSelected
                      ? 'text-primary text-4xl'
                      : isNeighbor
                        ? 'text-muted-foreground opacity-60 text-2xl'
                        : 'text-muted-foreground opacity-30 text-xl',
                  )}
                >
                  {item}
                </Text>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}
