import CookieConsent from "react-cookie-consent";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  return (
    <CookieConsent
  location="bottom"
  buttonText="Accept"
  declineButtonText="Reject"
  enableDeclineButton
  cookieName="rentmybike_cookie"

  style={{
    background: "#111827",
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
    zIndex: 9999,
  }}

  contentStyle={{
    margin: 0,
    flex: 1,
    fontSize: "15px",
    lineHeight: "22px",
  }}

  buttonStyle={{
    background: "#22a652",
    color: "#fff",
    borderRadius: "6px",
    padding: "10px 24px",
    fontWeight: 600,
    fontSize: "14px",
    minWidth: "110px",
    marginLeft: "10px",
  }}

  declineButtonStyle={{
    background: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "6px",
    padding: "10px 24px",
    fontWeight: 600,
    fontSize: "14px",
    minWidth: "110px",
    marginLeft: "10px",
  }}

  expires={365}
>
  We use cookies to improve your experience, keep you signed in,
  analyze traffic, and personalize content. By clicking
  <strong> Accept</strong>, you agree to our use of cookies.

  <Link
    to="/cookie-policy"
    style={{
      color: "#9FE870",
      marginLeft: 8,
      fontWeight: 600,
      textDecoration: "underline",
    }}
  >
    Learn more
  </Link>
</CookieConsent>
  );
};

export default CookieBanner;