<template>
  <div class="h-full flex flex-col">
    <div class="px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
      <h2 class="text-lg font-semibold text-gray-800 flex items-center">
        <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Versicherer
        <span class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {{ insurers.length }}
        </span>
      </h2>
    </div>
    
    <div class="flex-1 overflow-y-auto p-3">
      <div v-if="insurers.length === 0" class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Keine Versicherer gefunden</h3>
        <p class="mt-1 text-sm text-gray-500">Es wurden keine Versicherer in der Datenbank gefunden.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="insurer in insurers"
          :key="insurer.name"
          :class="[
            'group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border-2',
            'transform hover:-translate-y-0.5 hover:shadow-lg',
            isOverdue(insurer) 
              ? 'border-red-100 bg-red-50 hover:bg-red-50/80' 
              : 'border-gray-100 bg-white hover:bg-gray-50',
            selectedInsurer?.name === insurer.name 
              ? 'ring-2 ring-blue-500 ring-offset-2' 
              : ''
          ]"
          @click="selectInsurer(insurer)"
        >
          <!-- Status indicator bar -->
          <div 
            class="absolute top-0 left-0 h-1.5 w-full rounded-t-lg"
            :class="isOverdue(insurer) ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'"
          ></div>
          
          <div class="flex items-start justify-between pt-1">
            <div class="flex-1 min-w-0 pr-2">
              <h3 class="font-semibold text-gray-900 text-base flex items-center">
                {{ insurer.name }}
                <span 
                  v-if="isOverdue(insurer)"
                  class="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                >
                  Überfällig
                </span>
              </h3>
              
              <!-- Document Types -->
              <div class="flex items-center space-x-2 mt-2 flex-wrap">
                <!-- Document Type Badge -->
                <span v-if="insurer.dokumentenart" :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  insurer.dokumentenart === 'PDF' ? 'bg-red-100 text-red-800' :
                  insurer.dokumentenart === 'CSV' ? 'bg-blue-100 text-blue-800' :
                  insurer.dokumentenart === 'XML' ? 'bg-orange-100 text-orange-800' :
                  insurer.dokumentenart === 'XLS' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  <svg v-if="insurer.dokumentenart === 'PDF'" class="h-3 w-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else-if="insurer.dokumentenart === 'CSV'" class="h-3 w-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else-if="insurer.dokumentenart === 'XML'" class="h-3 w-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4.5 2a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2V4a2 2 0 00-2-2h-11zm0 1h11a1 1 0 011 1v12a1 1 0 01-1 1h-11a1 1 0 01-1-1V4a1 1 0 011-1zm3 2a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5h-5z"/>
                  </svg>
                  <svg v-else-if="insurer.dokumentenart === 'XLS'" class="h-3 w-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 00-1 1v14a1 1 0 001 1h6a1 1 0 001-1V9.5l-6-6zM4 4a1 1 0 00-1 1v10a1 1 0 001 1h2a1 1 0 100-2H5V6h1a1 1 0 100-2H4z"/>
                    <path d="M13 3.5V8h4.5L13 3.5z"/>
                  </svg>
                  {{ insurer.dokumentenart }}
                </span>

                <!-- Source Badge -->
                <span v-if="insurer.bezugsweg" :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  insurer.bezugsweg === 'BiPRO' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  <svg v-if="insurer.bezugsweg === 'BiPRO'" class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  {{ insurer.bezugsweg }}
                </span>

                <!-- Per Post Badge -->
                <span v-if="insurer.perPost" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  per Post
                </span>
              </div>

              <!-- Date Display -->
              <div class="bg-gray-50 rounded-lg p-2.5 space-y-1.5">
                <!-- Last Invoice Date -->
                <div v-if="insurer.last_invoice" class="flex items-center text-sm">
                  <span class="w-5 h-5 mr-2 flex items-center justify-center rounded-full" :class="isOverdue(insurer) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                    <svg v-if="isOverdue(insurer)" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <div>
                    <div class="text-xs text-gray-500">Letzte Abrechnung</div>
                    <div class="font-medium" :class="isOverdue(insurer) ? 'text-red-600' : 'text-gray-900'">{{ formatLastSettlement(insurer.last_invoice) }}</div>
                  </div>
                </div>
                
                <!-- Next Invoice Date -->
                <div v-if="insurer.next_invoice" class="flex items-center text-sm pt-1.5">
                  <span class="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <div class="text-xs text-gray-500">Nächste Abrechnung</div>
                    <div class="font-medium text-gray-900">{{ formatLastSettlement(insurer.next_invoice) }}</div>
                  </div>
                </div>
                
                <!-- Billing Cycle -->
                <div v-if="insurer.turnus" class="flex items-center text-sm pt-1.5">
                  <span class="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <div class="text-xs text-gray-500">Abrechnungszyklus</div>
                    <div class="font-medium text-gray-900">{{ formatTurnus(insurer.turnus) }}</div>
                  </div>
                </div>
                
                <!-- Overdue Warning -->
                <div v-if="isOverdue(insurer)" class="flex items-center text-xs text-red-600 mt-1">
                  <svg class="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ getOverdueDays(insurer) }} Tag(e) überfällig
                </div>
              </div>
            </div>
            
            <!-- Status indicator with pulse effect for overdue -->
            <div class="flex-shrink-0">
              <div 
                v-if="isOverdue(insurer)" 
                class="relative"
              >
                <div class="absolute inset-0 bg-red-500 rounded-full opacity-75 animate-ping"></div>
                <div class="relative w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
              <div v-else class="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          <!-- Hover indicator -->
          <div class="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { calculateDaysOverdue, isOverdue, formatLastSettlement } from '../utils/dateUtils.js'

const props = defineProps({
  insurers: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedInsurer: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['selectInsurer'])

const selectInsurer = (insurer) => {
  emit('selectInsurer', insurer)
}

// Format the billing cycle (turnus) for display
const formatTurnus = (turnus) => {
  const turnusMap = {
    'monatlich': 'Monatlich',
    'vierteljaehrlich': 'Vierteljährlich',
    'jaehrlich': 'Jährlich',
    'halbjaehrlich': 'Halbjährlich'
  }
  return turnusMap[turnus] || turnus
}

// Calculate and return the number of days an insurer is overdue
const getOverdueDays = (insurer) => {
  if (!insurer?.last_invoice) return 0
  return calculateDaysOverdue(insurer.last_invoice) - (insurer.turnus === 'monatlich' ? 30 : 90)
}
</script>

<style scoped>
/* Smooth transitions for hover effects */
.insurer-tile {
  transition: all 0.3s ease;
}

/* Custom scrollbar for the list container */
.insurer-list-container::-webkit-scrollbar {
  width: 6px;
}

.insurer-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.insurer-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.insurer-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>