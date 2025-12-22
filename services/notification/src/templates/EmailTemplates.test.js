/**
 * @file Tests for EmailTemplates module
 * @module templates/EmailTemplates.test
 */

import { describe, it, expect } from 'vitest'
import {
  getMaintenanceCreatedTemplate,
  getMaintenanceUpdatedTemplate,
  getMaintenanceResolvedTemplate,
  getTenantMaintenanceCreatedTemplate
} from './EmailTemplates.js'

describe('EmailTemplates', () => {
  describe('getMaintenanceCreatedTemplate', () => {
    it('should generate a valid email template with all required fields', () => {
      const testData = {
        reportId: '694936db88259f7797c48d95',
        apartmentAddress: 'A2',
        tenantName: 'Boende',
        category: 'Badrum',
        description: 'Kranar på handfatet är rostiga och läcker',
        status: 'Ny'
      }

      const result = getMaintenanceCreatedTemplate(testData)

      // Kontrollera att subject och html finns
      expect(result).toHaveProperty('subject')
      expect(result).toHaveProperty('html')

      // Kontrollera att subject innehåller lägenhetsnummer
      expect(result.subject).toBe('Ny felanmälan: A2')

      // Kontrollera att html är en string
      expect(typeof result.html).toBe('string')

      // Kontrollera att html innehåller viktiga data
      expect(result.html).toContain('A2') // apartmentAddress
      expect(result.html).toContain('Boende') // tenantName
      expect(result.html).toContain('694936db88259f7797c48d95') // reportId
      expect(result.html).toContain('Badrum') // category
      expect(result.html).toContain('Kranar på handfatet är rostiga och läcker') // description
      expect(result.html).toContain('Ny') // status

      // Kontrollera HTML-struktur
      expect(result.html).toContain('<!DOCTYPE html>')
      expect(result.html).toContain('Ny felanmälan inlämnad')
      expect(result.html).toContain('Felanmälningsdetaljer')
    })

    it('should handle special characters in description', () => {
      const testData = {
        reportId: 'test123',
        apartmentAddress: 'A1',
        tenantName: 'Test Tenant',
        category: 'Kök',
        description: 'Vattnet läcker & stänker överallt',
        status: 'Ny'
      }

      const result = getMaintenanceCreatedTemplate(testData)
      expect(result.html).toContain('läcker & stänker')
    })

    it('should include proper HTML styling', () => {
      const testData = {
        reportId: 'test',
        apartmentAddress: 'A3',
        tenantName: 'Test',
        category: 'Test',
        description: 'Test description',
        status: 'Ny'
      }

      const result = getMaintenanceCreatedTemplate(testData)
      expect(result.html).toContain('<style>')
      expect(result.html).toContain('#0284c7') // Brand color
      expect(result.html).toContain('</html>')
    })
  })

  describe('getMaintenanceUpdatedTemplate', () => {
    it('should generate a maintenance updated email with correct format', () => {
      const testData = {
        reportId: 'update123',
        apartmentAddress: 'A4',
        status: 'Påbörjad'
      }

      const result = getMaintenanceUpdatedTemplate(testData)

      expect(result).toHaveProperty('subject')
      expect(result).toHaveProperty('html')
      expect(result.subject).toBe('Uppdatering: Felanmälan A4')
      expect(result.html).toContain('update123')
    })
  })

  describe('getMaintenanceResolvedTemplate', () => {
    it('should generate a resolved maintenance email for tenant', () => {
      const testData = {
        reportId: 'resolved123',
        tenantName: 'Anna',
        resolutionDescription: 'Krana byttes ut'
      }

      const result = getMaintenanceResolvedTemplate(testData)

      expect(result.subject).toBe('Din felanmälan är löst')
      expect(result.html).toContain('Anna')
      expect(result.html).toContain('resolved123')
    })

    it('should handle missing resolution description gracefully', () => {
      const testData = {
        reportId: 'resolved456',
        tenantName: 'Erik',
        resolutionDescription: undefined
      }

      const result = getMaintenanceResolvedTemplate(testData)
      expect(result.html).toContain('Se detaljer i portalen')
    })
  })

  describe('getTenantMaintenanceCreatedTemplate', () => {
    it('should generate a tenant notification when maintenance is created', () => {
      const testData = {
        reportId: 'tenant123',
        apartmentAddress: 'A5',
        description: 'Fönstret är sprickat'
      }

      const result = getTenantMaintenanceCreatedTemplate(testData)

      expect(result.subject).toBe('Din felanmälan är registrerad')
      expect(result.html).toContain('A5')
      expect(result.html).toContain('tenant123')
    })
  })

  describe('Template structure validation', () => {
    it('all templates should return objects with subject and html properties', () => {
      const sampleData = {
        reportId: 'test',
        apartmentAddress: 'A1',
        tenantName: 'Test',
        category: 'Test',
        description: 'Test',
        status: 'Ny',
        resolutionDescription: 'Test'
      }

      const templates = [
        getMaintenanceCreatedTemplate(sampleData),
        getMaintenanceUpdatedTemplate(sampleData),
        getMaintenanceResolvedTemplate(sampleData),
        getTenantMaintenanceCreatedTemplate(sampleData)
      ]

      templates.forEach(template => {
        expect(template).toHaveProperty('subject')
        expect(template).toHaveProperty('html')
        expect(typeof template.subject).toBe('string')
        expect(typeof template.html).toBe('string')
        expect(template.subject.length).toBeGreaterThan(0)
        expect(template.html.length).toBeGreaterThan(50)
      })
    })
  })
})
