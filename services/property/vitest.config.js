import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Hitta testfiler i tests/ och src/ mappar
    include: ['tests/**/*.test.js', 'src/**/*.test.js'],
    // Exkludera node_modules
    exclude: ['node_modules'],
    // Environment för testen
    environment: 'node',
    // Visa detaljerad output
    reporter: 'default'
  }
})
