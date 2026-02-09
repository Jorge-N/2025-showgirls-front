import ItemButton from '@/components/ItemButton'
import { Text } from '@/components/ui/text'
import useCategories from '@/hooks/useCategories'
import { getIcon } from '@/lib/getIcon'
import { router, useLocalSearchParams } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { FlatList, View } from 'react-native'

const CategoriesList = () => {
  const { categoriesData } = useCategories()
  const { income } = useLocalSearchParams()

  return (
    <View className="w-full h-full bg-background items-center py-4">
      <Text className="text-lg font-bold">Elegí una categoría</Text>
      <Text className="text-base text-muted-foreground">
        El gasto se guardará en la categoría que elijas
      </Text>
      <View className="w-full p-4">
        <FlatList
          data={categoriesData}
          renderItem={({ item, index }) => (
            <ItemButton
              borderBottom={index !== (categoriesData?.length ?? 0) - 1}
              editable={false}
              iconLeft={getIcon(item.icono)}
              iconLeftColor={item.color}
              iconRight={ChevronRight}
              iconRightColor="white"
              background="background"
              text={item.nombre}
              badgeText={`$ ${item.totalGastos.toString()}`}
              onPress={() =>
                router.dismissTo({
                  pathname: '/income/modal/add',
                  params: { categoryId: item.id, income: income },
                })
              }
            />
          )}
        />
      </View>
    </View>
  )
}

export default CategoriesList
