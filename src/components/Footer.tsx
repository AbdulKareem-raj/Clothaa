import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Image src="/logo.svg" alt="Northline" width={120} height={38} className="footer-logo" />
          <p>Wear what moves you.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/shop">Shop all</Link>
          <Link href="/about">Our story</Link>
          <Link href="/blog">Journal</Link>
        </div>
        <div>
          <h3>Help</h3>
          <Link href="/faq">FAQ</Link>
          <Link href="/returns">Returns & exchanges</Link>
          <Link href="/contact">Contact us</Link>
        </div>
        <div>
          <h3>Legal</h3>
          <Link href="/privacy">Privacy policy</Link>
          <Link href="/cookies">Cookie policy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Northline · All rights reserved
      </div>
    </footer>
  )
}
