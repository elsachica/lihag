import mongoose from 'mongoose'

/**
 * Maintenance report schema representing a maintenance report with basic metadata to be shown to tenants and/or admins.
 */
const reportSchema = new mongoose.Schema(
  {
    apartmentId: {
      // by which property and tenant/reporter can be identified
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: [
        'Sovrum',
        'Kök',
        'Vardagsrum',
        'Badrum',
        'Klädkammare',
        'Balkong',
        'Hall',
        'Vitvaror',
        'Värme & ventilation',
        'El',
        'Vatten & avlopp',
        'Hiss',
        'Trapphus',
        'Entré',
        'Utegård',
        'Tvättstuga',
        'Miljörum',
        'Fastighet',
        'Parkering & garage',
        'Cykelrum',
        'Övrigt'
      ],
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    // access: {
    //   type: String,
    //   enum: ['Nyckel i tub eller lås i serviceläge', 'Möter upp', 'Ej aktuellt - allmänt utrymme'],
    //   required: true
    // },
    // pets: {
    //   type: Boolean,
    //   required: true
    // },
    status: {
      type: String,
      enum: ['Ny', 'Under behandling', 'Stängd'],
      default: 'Ny'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin only. one of the responsible admins
    priority: {
      // admin only
      type: String,
      enum: ['Låg', 'Medium', 'Hög', 'Akut']
    },
    images: [{ type: String }] // array of image URLs
  },
  { timestamps: true }
)

export const ReportModel = mongoose.model('Report', reportSchema)
