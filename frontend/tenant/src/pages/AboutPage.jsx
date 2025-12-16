import React from 'react'
import { PublicHeader, Navigation } from '../components/Header'
import { CheckCircle } from 'lucide-react'

/**
 * About Page - Information about Lihag AB
 */
export const AboutPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PublicHeader onNavigate={onNavigate} />
      <Navigation currentPage="about" onNavigate={onNavigate} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Om Lihag AB</h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Lihag AB är ett modernt fastighetsbolag med fokus på att erbjuda högkvalitativa bostäder och lokaler i
              Kalmar och Nybro. Sedan vår grundning har vi arbetat med att skapa trivsamma och hållbara
              boendemiljöer för våra hyresgäster.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vår historia</h2>
              <p>
                Lihag AB grundades med visionen att förändra fastighetsmarknaden genom att sätta hyresgästens behov
                i centrum. Vi tror på transparens, god service och långsiktiga relationer med våra hyresgäster.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Våra värderingar</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <strong className="text-gray-900">Kvalitet:</strong> Vi strävar efter att erbjuda moderna och
                    välskötta bostäder och lokaler.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <strong className="text-gray-900">Service:</strong> Snabb och professionell hantering av
                    felanmälningar och förfrågningar.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <strong className="text-gray-900">Hållbarhet:</strong> Vi arbetar aktivt med energieffektivisering
                    och miljövänliga lösningar.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <strong className="text-gray-900">Trygghet:</strong> Vi skapar trygga boendemiljöer där våra
                    hyresgäster trivs.
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Kontakta oss</h2>
              <p>
                Har du frågor eller vill veta mer om Lihag AB? Vi finns här för dig. Kontakta oss via telefon eller
                e-post så hjälper vi dig gärna.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
