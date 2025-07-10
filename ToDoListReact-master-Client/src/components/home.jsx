export const Home = () => {
  return (
    <div style={{ direction: "rtl", textAlign: "right", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow text-center p-4">
              <h1 className="mb-3" style={{ fontWeight: 700 }}>
                ברוכים הבאים לרשימת המטלות
              </h1>
              <p className="lead mb-0">
                כאן תוכלו לנהל את המשימות שלכם בקלות ובנוחות!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
