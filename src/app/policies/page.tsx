import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Store Policies | Northline',
}

export default function PoliciesPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">POLICIES</p>
        <h1>Store policies.</h1>
        <p>Shipping, returns and more.</p>
      </section>

      <main className="wrap prose">
        <h2>Shipping policy</h2>
        <p>
          Replace this placeholder with your actual shipping information, including
          estimated delivery times, carriers used and any restrictions. Free shipping
          is available on orders over $150.
        </p>

        <h2>Returns &amp; exchanges</h2>
        <p>
          Replace this placeholder with your return and exchange policy. Include the
          return window, condition requirements and the process customers should follow.
        </p>

        <h2>Privacy policy</h2>
        <p>
          Replace this placeholder with your privacy policy. Describe what data you
          collect, how it is used and how customers can request deletion.
        </p>

        <h2>Terms of service</h2>
        <p>
          Replace this placeholder with your terms of service before launch. Consult
          a legal professional if you are unsure about applicable laws in your region.
        </p>
      </main>
    </>
  )
}
