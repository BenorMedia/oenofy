export default function Home() {
  return (
    <>
      {/* Hero */}
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
            poster="/assets/hero-video-placeholder.png"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <nav
          id="site-nav"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 120px",
            pointerEvents: "none",
          }}
        >
          <div
            className="nav-group"
            style={{ display: "flex", gap: 120, pointerEvents: "auto" }}
          >
            <a
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.5,
                color: "#fff6e7",
              }}
            >
              Conciergerie
            </a>
            <a
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.5,
                color: "#fff6e7",
              }}
            >
              Collection
            </a>
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 24,
              transform: "translateX(-50%)",
              pointerEvents: "auto",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="53"
              height="53"
              viewBox="0 0 53 53"
              fill="none"
            >
              <path
                d="M26.4598 0C14.6367 0 5.01855 11.8637 5.01855 26.46C5.01855 41.0563 14.6367 52.92 26.4598 52.92C38.2829 52.92 47.901 41.0428 47.901 26.46C47.901 11.8772 38.2829 0 26.4598 0ZM45.7502 26.4465C45.7502 39.8523 37.0925 50.7556 26.4598 50.7556C15.8271 50.7556 7.16944 39.8523 7.16944 26.4465C7.16944 13.0406 15.8271 2.13736 26.4598 2.13736C37.0925 2.13736 45.7502 13.0406 45.7502 26.4465Z"
                fill="#F4EFEA"
              />
              <path
                d="M26.46 5.01855C11.8637 5.01855 0 14.6367 0 26.4598C0 38.2829 11.8773 47.9011 26.46 47.9011C41.0428 47.9011 52.92 38.2829 52.92 26.4598C52.92 14.6367 41.0563 5.01855 26.46 5.01855ZM50.7691 26.4463C50.7691 37.079 39.8659 45.7366 26.46 45.7366C13.0542 45.7366 2.15093 37.079 2.15093 26.4463C2.15093 15.8136 13.0542 7.15592 26.46 7.15592C39.8659 7.15592 50.7691 15.8136 50.7691 26.4463Z"
                fill="#F4EFEA"
              />
            </svg>
          </div>
          <div
            className="nav-group"
            style={{ display: "flex", gap: 120, pointerEvents: "auto" }}
          >
            <a
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.5,
                color: "#fff6e7",
              }}
            >
              Events
            </a>
            <a
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.5,
                color: "#fff6e7",
              }}
            >
              Contact us
            </a>
          </div>
        </nav>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <h1
            id="hero-title"
            style={{
              margin: 0,
              textAlign: "center",
              fontFamily: "var(--font-conso), serif",
              fontWeight: 400,
              textTransform: "uppercase",
              fontSize: 56,
              lineHeight: 1.15,
              color: "#fff6e7",
              letterSpacing: 0,
            }}
          >
            From Quiet Cellar
            <br />
            To Private Hands
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div
        id="intro-section"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#ffffff",
          padding: "160px 120px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <p
          id="intro-copy"
          style={{
            margin: 0,
            maxWidth: 1200,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 500,
            textTransform: "uppercase",
            lineHeight: 1.5,
            color: "#393839",
          }}
        >
          Every wine finds its origin somewhere between the vine, the terroir
          and the hands that shape it. Long before reaching the table, it
          carries a story, a place and the vision of those who created it.
          <br />
          <br />
          Coming from both wine production and private wine consultancy, we
          imagined OENOFY with a simple idea.
        </p>
        <img
          src="/assets/intro-quote.png"
          alt="To build every collection, cellar and experience as carefully as a tailor made piece. Benjamin and Anastasiia"
          style={{ marginTop: 64, maxWidth: 600, width: "100%", height: "auto" }}
        />
      </div>

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
            poster="/assets/hero-video-placeholder.png"
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
              color: "#fff6e7",
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
              color: "#fff6e7",
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
              color: "#fff6e7",
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
          backgroundImage: "url('/assets/quote-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          id="quote-box"
          style={{ position: "absolute", left: 120, top: 176, maxWidth: 760 }}
        >
          <p
            id="quote-text"
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.25,
              color: "#393839",
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
          background: "#ffffff",
          padding: "105px 10px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 15,
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
      >
        <div
          style={{
            height: 700,
            backgroundImage: "url('/assets/collection1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            height: 700,
            backgroundImage: "url('/assets/collection2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 80,
            boxSizing: "border-box",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-conso), serif",
                fontWeight: 400,
                textTransform: "uppercase",
                fontSize: 56,
                lineHeight: 1.15,
                color: "#393839",
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
                color: "#393839",
              }}
            >
              Discover →
            </a>
          </div>
        </div>
        <div
          style={{
            height: 700,
            backgroundImage: "url('/assets/collection3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Slider (center card only) */}
      <div
        id="slider-section"
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#ffffff",
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
            color: "#393839",
          }}
        >
          Where Wine Becomes Experience
        </h2>
        <div
          id="slider-outer"
          style={{
            background: "#eae6db",
            padding: 42,
            boxSizing: "border-box",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div
            id="slider-inner"
            style={{
              background: "#fff6e7",
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
                color: "#393839",
              }}
            >
              Monaco - YMC
            </h3>
            <img
              src="/assets/ymc-logo.png"
              alt="Yacht Club de Monaco"
              style={{
                width: "100%",
                maxWidth: 480,
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
                color: "#393839",
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
          background: "#ffffff",
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
            color: "#393839",
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
          <img
            src="/assets/news-cyprus.jpg"
            alt="Discover Cyprus Wine"
            style={{ width: 320, height: 260, objectFit: "cover" }}
          />
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
                color: "#ceba9a",
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
                color: "#393839",
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
                color: "#393839",
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
                color: "#393839",
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
          <img
            src="/assets/news-dhondt.jpg"
            alt="Dhondt-Grellet"
            style={{ width: 320, objectFit: "cover", height: 260 }}
          />
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
                color: "#ceba9a",
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
                color: "#393839",
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
                color: "#393839",
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
                color: "#393839",
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
