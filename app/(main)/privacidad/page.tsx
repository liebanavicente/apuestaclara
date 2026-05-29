export const metadata = { title: 'Política de privacidad — GañanesBets' }

export default function PrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Política de privacidad</h1>
      <p className="text-slate-500 text-sm mb-8">Última actualización: mayo 2026</p>

      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. Responsable del tratamiento</h2>
          <p>GañanesBets es responsable del tratamiento de los datos personales recogidos a través de esta plataforma.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Datos que recogemos</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Dirección de email y contraseña (para la cuenta)</li>
            <li>Datos de uso de la plataforma (simulaciones, generaciones)</li>
            <li>Datos de pago procesados por Stripe (no almacenamos datos de tarjeta)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Finalidad del tratamiento</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Prestación del servicio y gestión de la cuenta</li>
            <li>Mejora de la plataforma y análisis de uso</li>
            <li>Gestión de suscripciones y pagos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Base legal</h2>
          <p>El tratamiento se basa en la ejecución del contrato de servicio aceptado al registrarse y en el consentimiento del usuario.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Conservación de datos</h2>
          <p>Los datos se conservan mientras la cuenta esté activa. Al eliminar tu cuenta, los datos se borran en un plazo máximo de 30 días.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. Tus derechos</h2>
          <p>Puedes ejercer tus derechos de acceso, rectificación, supresión y portabilidad contactando en <span className="text-teal-400">hola@gananesbets.com</span>.</p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Servicios de terceros</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong className="text-slate-300">Supabase</strong> — base de datos y autenticación</li>
            <li><strong className="text-slate-300">Stripe</strong> — procesamiento de pagos</li>
            <li><strong className="text-slate-300">Vercel</strong> — alojamiento</li>
            <li><strong className="text-slate-300">Groq</strong> — análisis de IA</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
