import { LucideIcon, Pencil } from 'lucide-react-native'
import React from 'react'
import { Pressable, View } from 'react-native'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { Icon } from './ui/icon'
import { Text } from './ui/text'

export interface ItemCardProps {
  onPress?: () => void
  onLongPress?: () => void
  title: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  badgeText?: string
  badgeVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'positive'
  editable?: boolean
  onEdit?: () => void
}

const ItemCard = ({
  onLongPress,
  onPress,
  title,
  description,
  icon,
  iconColor,
  badgeText,
  badgeVariant = 'outline',
  editable,
  onEdit,
}: ItemCardProps) => {
  return (
    <Card
      className="border-0 flex-row w-full justify-between p-4 items-center mb-2 max-h-[200px]"
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View className="gap-1">
        <View className="flex-row items-center gap-2">
          <Text className="" numberOfLines={1}>
            {title}
          </Text>
        </View>
        <Text className="text-muted-foreground">{description}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {editable && (
          <Pressable
            onPress={() => {
              onEdit?.()
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${title}`}
          >
            <Pencil size={18} color="gray" />
          </Pressable>
        )}
        {badgeText && (
          <Badge variant={badgeVariant}>
            <Text className="text-base" numberOfLines={1}>
              {badgeText}
            </Text>
          </Badge>
        )}
        {icon && <Icon size={20} color={iconColor} as={icon} />}
      </View>
    </Card>
  )
}

export default ItemCard
