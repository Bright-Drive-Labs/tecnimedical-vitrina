const SUPABASE_URL = 'https://yxxlplorjolymdjffrca.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eGxwbG9yam9seW1kamZmcmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDYyMzUsImV4cCI6MjA4OTYyMjIzNX0.un9MLzYfndCqvAvrmfkmFY6Q01xXW-NOlYSAO3PFsqA';
const TECNIMEDICAL_ID = '63e2d67c-9b1a-4d3b-8f32-5a2e6f9c8d1b';

async function auditAndSeed() {
  console.log('--- Auditoría de Base de Datos Bright Drive ---');
  
  try {
    // 1. Consultar Tenants actuales
    const resTenants = await fetch(`${SUPABASE_URL}/rest/v1/tenants?select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const tenants = await resTenants.json();
    console.log('Tenants encontrados:', tenants.length);
    tenants.forEach(t => console.log(` - [${t.id}] ${t.name}`));

    // 2. Verificar si falta Tecnimedical
    const hasTecni = tenants.some(t => t.id === TECNIMEDICAL_ID);
    
    if (!hasTecni) {
      console.log('⚠️ Tecnimedical NO encontrado. Procediendo al sembrado...');
      const seedRes = await fetch(`${SUPABASE_URL}/rest/v1/tenants`, {
        method: 'POST',
        headers: { 
          'apikey': SUPABASE_KEY, 
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Preference': 'return=representation'
        },
        body: JSON.stringify({
          id: TECNIMEDICAL_ID,
          name: 'Tecnimedical',
          system_prompt: 'Eres el Agente Experto de Tecnimedical, especializado en equipos médicos y ortopedia.'
        })
      });
      if (seedRes.ok) console.log('✅ Registro de Tecnimedical creado con éxito.');
      else console.error('❌ Error al sembrar Tecnimedical:', await seedRes.text());
    } else {
      console.log('✅ Tecnimedical ya está correctamente registrado.');
    }

    // 3. Consultar Leads actuales
    const resLeads = await fetch(`${SUPABASE_URL}/rest/v1/tecnimedical_leads?select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const leads = await resLeads.json();
    console.log('Total de Leads registrados:', leads.length);

  } catch (err) {
    console.error('Fallo en la auditoría:', err.message);
  }
}

auditAndSeed();
