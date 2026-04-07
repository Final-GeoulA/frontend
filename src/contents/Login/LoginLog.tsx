import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./style/LoginLog.css";
import { useAuth } from "../../components/AuthProvider";

interface LoginLogItem {
  login_log_id: number;
  user_id: number;
  email: string;
  reip: string;
  uagent: string;
  status: string;
  sstime: string;
  eetime?: string | null;
}

const LoginLog: React.FC = () => {
  const { member } = useAuth();

  const [logs, setLogs] = useState<LoginLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!member?.user_id) {
      setLogs([]);
      setLoading(false);
      return;
    }

    const url = `${process.env.REACT_APP_BACK_END_URL}/loginlog/list?userId=${member.user_id}`;
    console.log("LOGIN LOG URL:", url);

    setLoading(true);

    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("LOGIN LOG RESPONSE:", res.data);
        setLogs(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("로그인 로그 조회 실패:", err);
        setLogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [member]);

  const summary = useMemo(() => {
    const loginCount = logs.filter((log) => log.status === "login").length;
    const logoutCount = logs.filter((log) => log.status === "logout").length;
    const lastLog = logs.length > 0 ? logs[0] : null;

    return {
      total: logs.length,
      loginCount,
      logoutCount,
      lastLog,
    };
  }, [logs]);

  return (
    <div className="loginlog-page">
      <h2 className="loginlog-page-title">로그인 기록</h2>

      <section className="loginlog-summary-card">
        <div className="loginlog-summary-grid">
          <div className="loginlog-summary-box">
            <p className="loginlog-summary-label">전체 기록</p>
            <strong className="loginlog-summary-value">{summary.total}</strong>
          </div>

          <div className="loginlog-summary-box">
            <p className="loginlog-summary-label">로그인</p>
            <strong className="loginlog-summary-value">
              {summary.loginCount}
            </strong>
          </div>

          <div className="loginlog-summary-box">
            <p className="loginlog-summary-label">로그아웃</p>
            <strong className="loginlog-summary-value">
              {summary.logoutCount}
            </strong>
          </div>
        </div>

        <div className="loginlog-last-box">
          <span className="loginlog-last-badge">최근 기록</span>
          <p className="loginlog-last-text">
            {summary.lastLog
              ? `${summary.lastLog.sstime} · ${
                  summary.lastLog.status === "login" ? "로그인" : "로그아웃"
                } · ${summary.lastLog.reip}`
              : "로그인 기록이 없습니다."}
          </p>
        </div>
      </section>

      <section className="loginlog-list-card">
        <div className="loginlog-list-header">
          <h3 className="loginlog-list-title">접속 내역</h3>
          <span className="loginlog-list-count">총 {logs.length}건</span>
        </div>

        {loading ? (
          <div className="loginlog-empty">로그인 기록을 불러오는 중입니다.</div>
        ) : logs.length === 0 ? (
          <div className="loginlog-empty">표시할 로그인 기록이 없습니다.</div>
        ) : (
          <div className="loginlog-list">
            {logs.map((log) => (
              <div className="loginlog-item" key={log.login_log_id}>
                <div className="loginlog-item-top">
                  <span
                    className={`loginlog-status ${
                      log.status === "login"
                        ? "loginlog-status-login"
                        : "loginlog-status-logout"
                    }`}
                  >
                    {log.status === "login" ? "로그인" : "로그아웃"}
                  </span>

                  <span className="loginlog-time">{log.sstime}</span>
                </div>

                <div className="loginlog-item-body">
                  <div className="loginlog-info-row">
                    <span className="loginlog-info-label">IP</span>
                    <span className="loginlog-info-value">{log.reip}</span>
                  </div>

                  <div className="loginlog-info-row">
                    <span className="loginlog-info-label">접속 환경</span>
                    <span className="loginlog-info-value">{log.uagent}</span>
                  </div>

                  <div className="loginlog-info-row">
                    <span className="loginlog-info-label">계정</span>
                    <span className="loginlog-info-value">{log.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LoginLog;