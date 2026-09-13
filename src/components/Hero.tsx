import {
  projectName,
  projectTagline,
  techBadges,
  metrics,
  githubPlaceholder,
} from "../data";
import { Reveal } from "./ui";

export function Hero(_props: { onExplore: () => void }) {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <header className="hero">
      <div className="wrap">
        <Reveal>
          <span className="hero-eyebrow">Full-Stack Engineering Portfolio</span>
          <h1>
            <span className="grad">{projectName}</span>
            <br />
            Built with MERN + Active Directory
          </h1>
          <p className="lead">{projectTagline}</p>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => go("architecture")}
            >
              Explore the architecture ↓
            </button>
            <button className="btn btn-ghost" onClick={() => go("api")}>
              Open API Explorer
            </button>
            <a
              className="btn btn-ghost"
              href={`https://github.com/${githubPlaceholder.frontend}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (githubPlaceholder.frontend.includes("your-")) {
                  e.preventDefault();
                  alert(
                    "Replace the GitHub link in portfolio-demo/src/data.ts → githubPlaceholder.frontend with your repo URL.",
                  );
                }
              }}
            >
              View Frontend on GitHub ↗
            </a>
            <a
              className="btn btn-ghost"
              href={`https://github.com/${githubPlaceholder.backend}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (githubPlaceholder.backend.includes("your-")) {
                  e.preventDefault();
                  alert(
                    "Replace the GitHub link in portfolio-demo/src/data.ts → githubPlaceholder.frontend with your repo URL.",
                  );
                }
              }}
            >
              View Backend on GitHub ↗
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="hero-stats">
            {metrics.slice(0, 6).map((m) => (
              <div className="hstat" key={m.label}>
                <b>{m.value}</b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="tabbar" style={{ marginTop: 28 }}>
            {techBadges.map((t) => (
              <span className="badge accent" key={t}>
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="status-line">
            mode: demo (simulated data) · backend URL:{" "}
            <span className="n">http://fin.norpetco.com:4000/api/v1</span> · api
            base is env-driven
          </p>
        </Reveal>
      </div>
    </header>
  );
}
