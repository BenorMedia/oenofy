import Image from "next/image";
import Preloader from "../components/Preloader";
import Hero from "../components/Hero";
import IntroSection from "../components/IntroSection";
import "./home.css";

export default function Home() {
  return (
    <>
      <Preloader />

      <Hero />

      <IntroSection />

      {/* Conciergerie */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/home/hero-video-placeholder.png"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        />
        <div
          id="conciergerie-box"
          style={{
            position: "absolute",
            left: 120,
            bottom: 176,
            zIndex: 2,
            maxWidth: 640,
          }}
        >
          <h2
            id="conciergerie-title"
            style={{
              margin: 0,
              fontFamily: "var(--font-conso), serif",
              fontWeight: 400,
              textTransform: "uppercase",
              fontSize: 56,
              lineHeight: 1.25,
              color: "var(--color-text-light)",
            }}
          >
            La Conciergerie
          </h2>
          <p
            style={{
              margin: "26.4px 0 0",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.8,
              color: "var(--color-text-light)",
            }}
          >
            Oenofy is a private wine concierge working with a limited number
            of clients on collections, private events and collector objects
            conceived around wine.
          </p>
          <a
            href="#"
            style={{
              display: "inline-block",
              marginTop: 35.2,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.5,
              color: "var(--color-text-light)",
            }}
          >
            Explore La Conciergerie →
          </a>
        </div>
      </div>

      {/* Quote */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <Image
          src="/assets/home/quote-bg.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center", zIndex: 0 }}
        />
        <div
          id="quote-box"
          style={{
            position: "absolute",
            left: 120,
            top: 176,
            maxWidth: 760,
            zIndex: 1,
          }}
        >
          <p
            id="quote-text"
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.25,
              color: "var(--color-text-dark)",
            }}
          >
            &ldquo;Alongside collections and private occasions, a quieter
            expression of the Oenofy world exists. Developed with selected
            designers and artisans, these pieces reflect the same attention to
            detail, materiality and time.&rdquo;
          </p>
        </div>
      </div>

      {/* Collection gallery */}
      <div
        id="collection-grid"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "var(--color-bg-page)",
          padding: "105px 10px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 15,
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <div style={{ position: "relative", height: 700 }}>
          <Image
            src="/assets/home/collection1.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div
          style={{
            height: 700,
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 80,
            boxSizing: "border-box",
          }}
        >
          <Image
            src="/assets/home/collection2.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center", zIndex: 0 }}
          />
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-conso), serif",
                fontWeight: 400,
                textTransform: "uppercase",
                fontSize: 56,
                lineHeight: 1.15,
                color: "var(--color-text-dark)",
              }}
            >
              Collection
            </h3>
            <a
              href="#"
              style={{
                display: "inline-block",
                marginTop: 24,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.5,
                color: "var(--color-text-dark)",
              }}
            >
              Discover →
            </a>
          </div>
        </div>
        <div style={{ position: "relative", height: 700 }}>
          <Image
            src="/assets/home/collection3.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>

      {/* Slider (center card only) */}
      <div
        id="slider-section"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "var(--color-bg-page)",
          padding: "130px 120px",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <h2
          id="slider-title"
          style={{
            margin: "0 0 48px",
            textAlign: "center",
            fontFamily: "var(--font-conso), serif",
            fontWeight: 400,
            textTransform: "uppercase",
            fontSize: 56,
            lineHeight: 1.15,
            color: "var(--color-text-dark)",
          }}
        >
          Where Wine Becomes Experience
        </h2>
        <div
          id="slider-outer"
          style={{
            background: "var(--color-bg-block)",
            padding: 42,
            boxSizing: "border-box",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div
            id="slider-inner"
            style={{
              background: "var(--color-text-light)",
              padding: 32,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 700,
                textTransform: "uppercase",
                lineHeight: 1.5,
                color: "var(--color-text-dark)",
              }}
            >
              Monaco - YMC
            </h3>
            <Image
              src="/assets/home/ymc-logo.png"
              alt="Yacht Club de Monaco"
              width={1280}
              height={720}
              sizes="(max-width: 480px) 100vw, 480px"
              style={{
                width: "100%",
                maxWidth: 480,
                height: "auto",
                margin: "40px auto",
                display: "block",
              }}
            />
            <a
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.5,
                color: "var(--color-text-dark)",
              }}
            >
              More information →
            </a>
          </div>
        </div>
      </div>

      {/* News */}
      <div
        id="news-section"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "var(--color-bg-page)",
          padding: 120,
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <h2
          id="news-title"
          style={{
            margin: "0 0 64px",
            fontFamily: "var(--font-conso), serif",
            fontWeight: 400,
            textTransform: "uppercase",
            fontSize: 56,
            lineHeight: 1.15,
            color: "var(--color-text-dark)",
          }}
        >
          News
        </h2>

        <div
          className="news-row"
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          <div style={{ position: "relative", width: 320, height: 260 }}>
            <Image
              src="/assets/home/news-cyprus.jpg"
              alt="Discover Cyprus Wine"
              fill
              sizes="320px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "auto",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 800,
                textTransform: "uppercase",
                lineHeight: 1.5,
                color: "var(--color-accent)",
              }}
            >
              Discover Cyprus Wine
            </h3>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.25,
                color: "var(--color-text-dark)",
              }}
            >
              Where altitude meets rarity.
            </p>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.25,
                color: "var(--color-text-dark)",
              }}
            >
              Nestled high in the Troodos Mountains, Vouni Panayia is one of
              Cyprus&apos; most remarkable estates. Its high-altitude
              vineyards, indigenous grape varieties and meticulous
              micro-vinifications produce wines of exceptional precision and
              character. Crafted in extremely limited quantities, each cuvée
              reflects a distinctive expression of Cyprus&apos; mountainous
              terroir and a commitment to preserving the island&apos;s unique
              winemaking heritage.
            </p>
            <a
              href="#"
              style={{
                marginTop: 35,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.5,
                color: "var(--color-text-dark)",
              }}
            >
              Discover →
            </a>
          </div>
        </div>

        <div
          className="news-row"
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: 48,
            height: "auto",
          }}
        >
          <div style={{ position: "relative", width: 320, height: 260 }}>
            <Image
              src="/assets/home/news-dhondt.jpg"
              alt="Dhondt-Grellet"
              fill
              sizes="320px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "auto",
              marginBottom: "auto",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 800,
                textTransform: "uppercase",
                lineHeight: 1.5,
                color: "var(--color-accent)",
              }}
            >
              Dhondt-Grellet
            </h3>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.25,
                color: "var(--color-text-dark)",
              }}
            >
              Precision without excess. Purity without compromise.
            </p>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.25,
                color: "var(--color-text-dark)",
              }}
            >
              Among the most compelling names of Champagne&apos;s new
              generation, Dhondt-Grellet has earned a reputation for producing
              remarkably precise, terroir-driven wines. Working primarily with
              old Chardonnay vines on the Côte des Blancs, the estate embraces
              low-intervention winemaking, careful élevage and limited
              production to reveal the character of each individual parcel.
              Every bottle reflects balance, tension and quiet complexity —
              champagnes made for those who value authenticity over prestige
              alone.
            </p>
            <a
              href="#"
              style={{
                marginTop: 35,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.5,
                color: "var(--color-text-dark)",
              }}
            >
              Discover →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
