import MangaPanel from '../components/MangaPanel'
import PriceTable from '../components/PriceTable'
import TermsSection from '../components/TermsSection'
import OrderForm from '../components/OrderForm'

export default function Order() {
  return (
    <div className="pt-16">
      {/* page header */}
      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="mt-3 font-display text-5xl tracking-wide uppercase sm:text-7xl">
            Let's ink your idea
          </h1>
          <p className="mt-4 max-w-xl text-ink/55">
            check the price list, read the terms, then fill the form - your order
            goes straight to WhatsApp with a ready-made brief.
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-24 py-16 sm:py-24">
        <MangaPanel title="Price list">
          <PriceTable />
        </MangaPanel>

        <MangaPanel title="Terms of service">
          <TermsSection />
        </MangaPanel>

        <MangaPanel title="Order form" id="order-form">
          <p className="-mt-4 mb-10 max-w-xl text-ink/50">
            fill this in and hit send - a formatted order message will open in
            WhatsApp. no account needed, no back-and-forth guessing.
          </p>
          <OrderForm />
        </MangaPanel>
      </div>
    </div>
  )
}
