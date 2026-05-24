/**
 * Dashboard shell. In production it calls `GET /api/me/modules` and renders the
 * nav + widgets the API returns for the signed-in tenant. This placeholder shows
 * the manifest-driven shape without a backend yet.
 */
export default function DashboardPage() {
  return (
    <main style={{ padding: 32, maxWidth: 960, margin: '0 auto' }}>
      <h1>AION</h1>
      <p style={{ color: '#666' }}>
        Niche-aware modular platform. The nav and widgets below are rendered from the
        tenant&apos;s enabled <strong>module manifests</strong> — not hard-coded per niche.
      </p>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 16 }}>How this page will work</h2>
        <ol style={{ color: '#444', lineHeight: 1.6 }}>
          <li>Sign in → API resolves the tenant&apos;s niche profile ∩ entitlements.</li>
          <li>
            <code>GET /api/me/modules</code> returns enabled modules with their nav + widgets.
          </li>
          <li>
            <code>resolveNavAndWidgets()</code> (see <code>src/lib/modules.ts</code>) maps those
            into the sidebar and dashboard grid.
          </li>
        </ol>
        <p style={{ color: '#888', fontSize: 13 }}>
          A restaurant tenant sees Menu / Orders / Inventory / Providers; a salon sees Calendar
          / Chairs / Customers — same component, different manifests.
        </p>
      </section>
    </main>
  );
}
