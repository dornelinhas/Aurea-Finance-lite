import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'financy_dismissed_insights'

// Load from localStorage
const loadDismissed = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? new Set(JSON.parse(data)) : new Set()
    } catch {
        return new Set()
    }
}

const notifications = ref([])
const dismissedInsightIds = ref(loadDismissed())

// Watch for changes and save
watch(dismissedInsightIds, (newSet) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSet]))
}, { deep: true })

export function useNotifications() {
  const addNotification = (insight) => {
    if (!notifications.value.find(n => n.id === insight.id)) {
      notifications.value.unshift(insight)
    }
    // Deep copy to trigger watch
    dismissedInsightIds.value = new Set([...dismissedInsightIds.value, insight.id])
  }

  const clearNotifications = () => {
    // When user clears all, they should definitely stay as "read/dismissed" globally
    notifications.value.forEach(n => {
        dismissedInsightIds.value.add(n.id)
    })
    dismissedInsightIds.value = new Set(dismissedInsightIds.value)
    notifications.value = []
  }

  const removeNotification = (id) => {
    // Already in dismissedInsightIds from when it was moved to notification center
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const unreadCount = computed(() => notifications.value.length)

  return { 
    notifications, 
    dismissedInsightIds, 
    addNotification, 
    clearNotifications, 
    removeNotification, 
    unreadCount 
  }
}
