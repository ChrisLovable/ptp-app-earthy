import { supabase } from './supabase'

// Convert camelCase to snake_case for Supabase
const toSnakeCase = (obj) => {
  const result = {}
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    result[snakeKey] = obj[key]
  }
  return result
}

// Convert snake_case to camelCase from Supabase
const toCamelCase = (obj) => {
  if (!obj) return obj
  const result = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    result[camelKey] = obj[key]
  }
  return result
}

export const database = {
  // Get all players
  async getAllPlayers() {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('last_updated', { ascending: false })
      
      if (error) throw error
      return (data || []).map(toCamelCase)
    } catch (error) {
      console.error('Error getting players:', error)
      return []
    }
  },

  // Get single player
  async getPlayer(playerId) {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single()
      
      if (error) throw error
      return toCamelCase(data)
    } catch (error) {
      console.error('Error getting player:', error)
      return null
    }
  },

  // Add new player
  async addPlayer(playerData) {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const newPlayer = toSnakeCase({
        ...playerData,
        lastUpdated: today,
        createdAt: new Date().toISOString()
      })

      const { data, error } = await supabase
        .from('players')
        .insert([newPlayer])
        .select()
        .single()
      
      if (error) throw error
      return toCamelCase(data)
    } catch (error) {
      console.error('Error adding player:', error)
      throw error
    }
  },

  // Update player
  async updatePlayer(playerId, playerData) {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Save current version to history first
      const currentPlayer = await this.getPlayer(playerId)
      if (currentPlayer) {
        await this.saveHistory(playerId, currentPlayer)
      }

      const updatedData = toSnakeCase({
        ...playerData,
        lastUpdated: today,
        updatedAt: new Date().toISOString()
      })

      const { error } = await supabase
        .from('players')
        .update(updatedData)
        .eq('id', playerId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error updating player:', error)
      throw error
    }
  },

  // Delete player
  async deletePlayer(playerId) {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting player:', error)
      throw error
    }
  },

  // Save player history
  async saveHistory(playerId, playerData) {
    try {
      const { error } = await supabase
        .from('player_history')
        .insert([{
          player_id: playerId,
          player_data: playerData,
          saved_at: new Date().toISOString()
        }])
      
      if (error) throw error
    } catch (error) {
      console.error('Error saving history:', error)
    }
  },

  // Get player history
  async getPlayerHistory(playerId) {
    try {
      const { data, error } = await supabase
        .from('player_history')
        .select('*')
        .eq('player_id', playerId)
        .order('saved_at', { ascending: false })
      
      if (error) throw error
      return (data || []).map(h => ({
        historyId: h.id,
        playerId: h.player_id,
        savedAt: h.saved_at,
        ...h.player_data
      }))
    } catch (error) {
      console.error('Error getting history:', error)
      return []
    }
  },

  // Export all data
  async exportData() {
    try {
      const players = await this.getAllPlayers()
      return {
        players,
        exportDate: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      return { players: [], exportDate: new Date().toISOString() }
    }
  },

  // Import data
  async importData(data) {
    try {
      if (data.players && Array.isArray(data.players)) {
        const snakePlayers = data.players.map(toSnakeCase)
        const { error } = await supabase
          .from('players')
          .upsert(snakePlayers, { onConflict: 'id' })
        
        if (error) throw error
        return { success: true }
      }
      return { success: false, error: 'Invalid data format' }
    } catch (error) {
      console.error('Error importing data:', error)
      return { success: false, error: error.message }
    }
  }
}
