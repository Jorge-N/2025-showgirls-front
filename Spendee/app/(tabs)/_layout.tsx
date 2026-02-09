import { TabBar } from '@/components/TabBar'
import { useAuth } from '@/context/AuthContext'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabsLayout() {
  const { user, loading } = useAuth()

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: `Hola ${!loading ? user?.displayName : 'Cargando...'}`,
          tabBarLabel: 'Home',
          headerTitleAlign: 'left',
          headerShadowVisible: false,
        }}
      />
      <Tabs.Screen
        name="movements"
        options={{
          title: 'Historial de Movimientos',
          tabBarLabel: 'Historial',
        }}
      />
      <Tabs.Screen
        name="piggy"
        options={{
          title: 'Piggy',
          tabBarLabel: 'Piggy',
        }}
      />
      <Tabs.Screen
        name="fixed-expenses"
        options={{
          title: 'Gastos Fijos',
          tabBarLabel: 'Fijos',
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  )
}
