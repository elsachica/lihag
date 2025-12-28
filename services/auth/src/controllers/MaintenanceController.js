export class MaintenanceController {
  constructor() {
    this.backendUrl = process.env.MAINTENANCE_URL
  }

  // Hämta alla rapporter
  async getAllReports(req, res, next) {
    try {
      const queryString = new URLSearchParams(req.query).toString()
      const url = queryString ? `${this.backendUrl}?${queryString}` : this.backendUrl
      const response = await fetch(url)
      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  // Hämta en rapport med id
  async getReport(req, res, next) {
    try {
      const response = await fetch(`${this.backendUrl}/${req.params.id}`)
      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  // Skapa ny rapport
  async createReport(req, res, next) {
    try {
      const response = await fetch(this.backendUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req.body)
      })

      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  // Uppdatera rapport
  async updateReport(req, res, next) {
    try {
      const response = await fetch(`${this.backendUrl}/${req.params.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req.body)
      })

      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  // Ta bort rapport (admin only)
  async deleteReport(req, res, next) {
    try {
      const response = await fetch(`${this.backendUrl}/${req.params.id}`, {
        method: 'DELETE'
      })

      res.status(response.status).end()
    } catch (err) {
      next(err)
    }
  }
}
