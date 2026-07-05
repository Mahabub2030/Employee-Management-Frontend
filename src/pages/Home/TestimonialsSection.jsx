export function TestimonialsSection() {
  const [hoveredReview, setHoveredReview] =
    (React.useState < string) | (null > null);

  return (
    <section
      className="animate-fade-up"
      style={{
        marginBottom: "100px",
        animationDelay: "0.5s",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <span
          style={{
            color: "#4f46e5",
            fontSize: "14px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Success Stories
        </span>
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginTop: "8px",
            marginBottom: "16px",
          }}
        >
          Trusted by Industry Innovators
        </h2>
        <p
          style={{
            color: "#6b7280",
            maxWidth: "600px",
            margin: "0 auto",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          See how teams utilize our data frequency platforms to maximize
          infrastructure throughput.
        </p>
      </div>

      {/* Review Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
        }}
      >
        {mockTestimonials.map((review) => (
          <div
            key={review.id}
            onMouseEnter={() => setHoveredReview(review.id)}
            onMouseLeave={() => setHoveredReview(null)}
            style={{
              backgroundColor: "#fff",
              padding: "32px",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              boxShadow:
                hoveredReview === review.id
                  ? "0 20px 25px -5px rgba(0,0,0,0.06)"
                  : "0 4px 6px -1px rgba(0,0,0,0.01)",
              transform:
                hoveredReview === review.id
                  ? "translateY(-6px)"
                  : "translateY(0)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Decorative Quote Mark */}
            <span
              style={{
                position: "absolute",
                top: "16px",
                right: "24px",
                fontSize: "64px",
                color: "#e5e7eb",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
                pointerEvents: "none",
              }}
            >
              “
            </span>

            {/* Quote Body */}
            <div>
              <div style={{ marginBottom: "12px", fontSize: "14px" }}>
                {review.rating}
              </div>
              <p
                style={{
                  color: "#374151",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  fontStyle: "italic",
                  margin: "0 0 24px 0",
                }}
              >
                "{review.quote}"
              </p>
            </div>

            {/* Author Profile Information */}
            <div
              style={{
                borderTop: "1px solid #f3f4f6",
                paddingTop: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#e0e7ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  marginRight: "12px",
                  fontWeight: "bold",
                  color: "#4f46e5",
                }}
              >
                {review.author.charAt(0)}
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    margin: 0,
                    color: "#111827",
                  }}
                >
                  {review.author}
                </h4>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    margin: 0,
                    marginTop: "2px",
                  }}
                >
                  {review.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
