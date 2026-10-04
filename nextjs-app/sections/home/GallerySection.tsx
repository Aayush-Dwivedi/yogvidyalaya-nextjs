import React from 'react';
import { Container } from '../../components/Container';
import { SectionHeader } from '../../components/SectionHeader';
import { Badge } from '../../components/Badge';
import { LinkButton } from '../../components/LinkButton';
import { GALLERY_HIGHLIGHTS } from '../../services/homeData';
import { CornerFlourish, LotusMotif } from '../../components/Motifs';

export const GallerySection: React.FC = () => {
  const [img1, img2, img3] = GALLERY_HIGHLIGHTS;

  return (
    <section className="py-20 sm:py-28 bg-canvas relative overflow-hidden border-b border-border/70">
      <Container size="wide">
        <SectionHeader
          eyebrow="Institute Moments"
          title="Gallery"
          description="Photos from our classes and events"
          align="asymmetric"
          motif={<LotusMotif size={28} />}
          action={
            <LinkButton to="/gallery" variant="text" size="md" withArrow>
              View More Images
            </LinkButton>
          }
        />

        {/* Asymmetric Gallery Composition (Varying Dimensions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Large Feature Frame (7 cols) */}
          <div className="lg:col-span-7 bg-surface border border-border p-2 rounded-[2px] shadow-card group">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1px] bg-surface-subtle">
              <img
                src={img1.image}
                alt={img1.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3">
                <Badge variant="dark" size="sm">
                  {img1.category}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-ivory">
                <h3 className="text-xl sm:text-2xl font-editorial font-normal leading-snug">
                  {img1.title}
                </h3>
                <p className="text-xs text-ivory/80 font-sans mt-1 line-clamp-2">
                  {img1.caption}
                </p>
              </div>
            </div>
          </div>

          {/* Stacked Complementary Frames (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Frame 2 */}
            <div className="bg-surface border border-border p-2 rounded-[2px] shadow-card group relative flex-grow">
              <div className="absolute top-3 right-3 z-10">
                <CornerFlourish position="top-right" className="text-gold-400" />
              </div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1px] bg-surface-subtle">
                <img
                  src={img2.image}
                  alt={img2.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="plum" size="sm">
                    {img2.category}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-base font-editorial font-normal text-plum-900">
                  {img2.title}
                </h4>
                <p className="text-[11px] text-ink-muted font-sans mt-0.5">
                  {img2.caption}
                </p>
              </div>
            </div>

            {/* Frame 3 */}
            <div className="bg-surface border border-border p-2 rounded-[2px] shadow-card group relative flex-grow">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1px] bg-surface-subtle">
                <img
                  src={img3.image}
                  alt={img3.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="earth" size="sm">
                    {img3.category}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-base font-editorial font-normal text-plum-900">
                  {img3.title}
                </h4>
                <p className="text-[11px] text-ink-muted font-sans mt-0.5">
                  {img3.caption}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA for Mobile & Tablet */}
        <div className="mt-12 text-center lg:hidden">
          <LinkButton to="/gallery" variant="secondary" size="md" withArrow>
            View More Images
          </LinkButton>
        </div>
      </Container>
    </section>
  );
};
