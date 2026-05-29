<template>
  <div class="home-shell">
    <div class="hero-panel">
      <div class="hero-copy">
        <img src="/logo.svg" alt="School Logo" class="hero-logo" />
        <h1>Urafiki Carovana School Admission Form</h1>
        <p>Join Us and let us build the Kingdom of God together</p>
      </div>
      <div class="hero-card">
        <p class="hero-card-label">Apply now</p>
        <h2>Choose the correct application form</h2>
        <div class="links">
          <NuxtLink to="/primary" class="btn">Primary School</NuxtLink>
          <NuxtLink to="/junior" class="btn secondary">Junior School</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-shell{min-height:100vh;width:100%;background:linear-gradient(180deg,#fff6eb 0%,#fff 45%,#ffefd8 100%);display:flex;align-items:center;justify-content:center;padding:40px;box-sizing:border-box}
.hero-panel{max-width:1100px;width:100%;display:grid;grid-template-columns:1.2fr 0.8fr;gap:32px;align-items:center}
.hero-copy{padding:40px;background:rgba(255,255,255,.92);border-radius:32px;box-shadow:0 40px 80px rgba(0,0,0,.08);}
.hero-logo{width:72px;height:72px;margin-bottom:24px}
.hero-copy h1{font-size:clamp(2.2rem,2.6vw,3.8rem);margin:0 0 16px;color:#2b1f0f}
.hero-copy p{font-size:1.05rem;line-height:1.8;color:#57472e;max-width:560px}
.hero-card{background:#fff;border-radius:32px;padding:32px;box-shadow:0 30px 60px rgba(0,0,0,.08);border:1px solid rgba(255,154,0,.18)}
.hero-card-label{margin:0 0 8px;font-size:.9rem;font-weight:700;text-transform:uppercase;color:#ff7600;letter-spacing:.12em}
.hero-card h2{margin:0 0 24px;color:#2b1f0f;font-size:1.75rem;line-height:1.2}
.links{display:flex;flex-wrap:wrap;gap:16px}
.btn{padding:16px 22px;border-radius:999px;font-weight:700;background:#ff8500;color:#fff;text-decoration:none;box-shadow:0 18px 38px rgba(255,133,0,.2);transition:transform .2s ease,box-shadow .2s ease}
.btn:hover{transform:translateY(-1px);box-shadow:0 22px 48px rgba(255,133,0,.3)}
.btn.secondary{background:#ffbc6a;color:#2b1f0f}
@media (max-width: 860px){.home-shell{padding:32px 16px}.hero-panel{grid-template-columns:1fr}.hero-card{margin-top:24px}}
@media (max-width: 560px){.hero-copy{padding:28px}.hero-card{padding:24px}.hero-card h2{font-size:1.4rem}.btn{width:100%;justify-content:center}}
</style>
