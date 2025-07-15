import "../Footer.css";
import logo from "../img/logo.png";

const Footer = () => {
  return (
    <div className="footer-section">
      <footer>
        <div className="container">
          <section className="mt-5">
            <div className="row text-center d-flex justify-content-center pt-5">
              <div className="col-md-2">
                <h6 className="text-uppercase font-weight-bold">
                  <a href="#!" className="footer-link">
                    Home
                  </a>
                </h6>
              </div>

              <div className="col-md-2">
                <h6 className="text-uppercase font-weight-bold">
                  <a href="#!" className="footer-link">
                    Menú
                  </a>
                </h6>
              </div>

              <div className="col-md-2">
                <h6 className="text-uppercase font-weight-bold">
                  <a href="#!" className="footer-link">
                    Ofertas
                  </a>
                </h6>
              </div>

              <div className="col-md-2">
                <h6 className="text-uppercase font-weight-bold">
                  <a href="#!" className="footer-link">
                    Perfil
                  </a>
                </h6>
              </div>

              <div className="col-md-2">
                <h6 className="text-uppercase font-weight-bold">
                  <a href="#!" className="footer-link">
                    Contacto
                  </a>
                </h6>
              </div>
            </div>
          </section>

          <hr className="my-5" />

          <img src={logo} alt="Logo EcoCycle" className="footer-logo" />
          <section className="mb-5">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-8"></div>
            </div>
          </section>
          <div className="footer-bottom text-center">
            <p>
              © 2024 Copyright: &nbsp;
              <a href="#">EcoCycle</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
