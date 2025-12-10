export class ApartmentController {
  constructor() {
    this.backendUrl = 'http://apartment-backend-service/apartments'
  }

  async index(req, res, next) {
    try {
      const queryString = new URLSearchParams(req.query).toString()
      const response = await fetch(`${this.backendUrl}?${queryString}`)
      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  async show(req, res, next) {
    try {
      const response = await fetch(`${this.backendUrl}/${req.params.id}`)
      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  async statistics(req, res, next) {
    try {
      const response = await fetch(`${this.backendUrl}/statistics`)
      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  async create(req, res, next) {
    try {
      const response = await fetch(this.backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      })
      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const response = await fetch(`${this.backendUrl}/${req.params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      })
      const data = await response.json()
      res.status(response.status).json(data)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
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
