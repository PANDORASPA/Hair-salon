import PageIntro from '../components/PageIntro'
import { getPublicSalonContent } from '../../lib/content/public-content'
export const metadata = { title: 'Gallery' }
export default async function GalleryPage() { const salon=await getPublicSalonContent();return <><PageIntro eyebrow="Gallery" title="Recent work"><p>Cuts, colour, perms and quiet moments from our Bristol studio.</p></PageIntro><section className="salon-wrap salon-section"><div className="salon-gallery large">{salon.gallery.map((image) => <figure key={image.id || image.path}><img src={image.path} alt={image.alt} /><figcaption>{image.label}</figcaption></figure>)}</div></section></> }
