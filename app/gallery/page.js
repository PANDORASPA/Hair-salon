import PageIntro from '../components/PageIntro'
import defaultsModule from '../../content/salon-poke-defaults'
const { salonDefaults } = defaultsModule
export const metadata = { title: 'Gallery' }
export default function GalleryPage() { return <><PageIntro eyebrow="Gallery" title="Recent work"><p>Cuts, colour, perms and quiet moments from our Bristol studio.</p></PageIntro><section className="salon-wrap salon-section"><div className="salon-gallery large">{salonDefaults.gallery.map((image) => <figure key={image.path}><img src={image.path} alt={image.alt} /><figcaption>{image.label}</figcaption></figure>)}</div></section></> }
