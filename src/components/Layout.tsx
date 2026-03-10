import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface LayoutProps {
  children: React.ReactNode;
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { member, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const authLinkStyle: React.CSSProperties = {
    color: "black",
    fontSize: "13px",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "none",
  };
  return (
    <div>
      <header
        style={{
          background: "#f8f9fa",
          padding: "10px 20px 0",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {/* 로고 */}
          <Link
            to="/"
            style={{ fontSize: "24px", textDecoration: "none", color: "black" }}
          >
          </Link>

          {/* 오른쪽 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {member ? (
              <>
                <span style={{ fontSize: "13px" }}>
                  {member.nickname}님 환영합니다.
                </span>
                <button onClick={handleLogout} style={authLinkStyle}>
                  로그아웃
                </button>
              </>
            ) : (
              <>

              </>
            )}
          </div>
        </div>

        <Navbar />
      </header>

      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
};

export default Layout;
