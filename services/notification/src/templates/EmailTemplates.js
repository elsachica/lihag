/**
 * @file Email templates for different notification types.
 * @module templates/EmailTemplates
 * @version 1.0.0
 */

/**
 * Template for maintenance.created event (admin notification).
 * Skickas till admin när en ny felanmälan skapas.
 *
 * @param {object} data - Email data
 * @returns {object} - { subject, html }
 */
export function getMaintenanceCreatedTemplate (data) {
  const { reportId, apartmentAddress, tenantName, category, description, status } = data

  const subject = `Ny felanmälan: ${apartmentAddress}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #0284c7;
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background-color: #f0f9ff;
          padding: 30px 20px;
        }
        .detail-section {
          background-color: white;
          padding: 15px;
          border-left: 4px solid #0284c7;
          margin: 15px 0;
          border-radius: 4px;
        }
        .detail-section p {
          margin: 8px 0;
          line-height: 1.6;
        }
        .detail-section strong {
          color: #0284c7;
        }
        .problem-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-radius: 0 0 8px 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ny felanmälan inlämnad</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #075985; margin-top: 0;">Felanmälningsdetaljer</h2>
          
          <div class="detail-section">
            <p><strong>Lägenhet:</strong> ${apartmentAddress}</p>
            <p><strong>Hyresgäst:</strong> ${tenantName}</p>
            <p><strong>Felanmälan ID:</strong> ${reportId}</p>
            <p><strong>Kategori:</strong> ${category}</p>
            <p><strong>Status:</strong> ${status}</p>
          </div>

          <h3 style="color: #075985;">Problem</h3>
          <div class="problem-box">
            <p>${description || 'Ingen beskrivning tillgänglig'}</p>
          </div>

          <p style="color: #374151; margin-top: 20px;">
            <strong>Nästa steg:</strong> Logga in på admin-portalen för att hantera denna felanmälan.
          </p>
        </div>

        <div class="footer">
          <p>Det här är ett automatiskt genererat email från Lihag AB.<br>
          Svara inte på detta email.</p>
          <p style="margin-top: 10px; color: #9ca3af;">
            © 2025 Lihag AB. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return { subject, html }
}

/**
 * Template for maintenance.updated event (admin notification).
 * Skickas till admin när en felanmälan har uppdaterats.
 *
 * @param {object} data - Email data
 * @returns {object} - { subject, html }
 */
export function getMaintenanceUpdatedTemplate (data) {
  const { reportId, apartmentAddress, status } = data

  const subject = `Uppdatering: Felanmälan ${apartmentAddress}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>Felanmälan uppdaterad</h1>
      <p>Felanmälan <strong>${reportId}</strong> har uppdaterats.</p>
      <p><strong>Ny status:</strong> ${status}</p>
      <p>Logga in på admin-portalen för mer information.</p>
    </body>
    </html>
  `

  return { subject, html }
}

/**
 * Template for tenant notification when maintenance is resolved.
 *
 * @param {object} data - Email data
 * @returns {object} - { subject, html }
 */
export function getMaintenanceResolvedTemplate (data) {
  const { reportId, tenantName, resolutionDescription } = data

  const subject = 'Din felanmälan är löst'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>Din felanmälan är löst</h1>
      <p>Hej ${tenantName},</p>
      <p>Din felanmälan <strong>${reportId}</strong> har lösts.</p>
      <h3>Åtgärd som genomfördes:</h3>
      <p>${resolutionDescription || 'Se detaljer i portalen'}</p>
    </body>
    </html>
  `

  return { subject, html }
}

/**
 * Template for tenant notification when maintenance is created.
 * TODO: Implementera senare - skicka till tenant om felanmälan är registrerad.
 *
 * @param {object} data - Email data
 * @returns {object} - { subject, html }
 */
export function getTenantMaintenanceCreatedTemplate (data) {
  const { reportId, apartmentAddress, description } = data

  const subject = 'Din felanmälan är registrerad'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <h1>Din felanmälan är registrerad</h1>
      <p>Din felanmälan för ${apartmentAddress} har registrerats.</p>
      <p><strong>Felanmälan ID:</strong> ${reportId}</p>
      <p><strong>Problem:</strong> ${description}</p>
      <p>Vi kontaktar dig så snart vi kan åtgärda problemet.</p>
    </body>
    </html>
  `

  return { subject, html }
}
