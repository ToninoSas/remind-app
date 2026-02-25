import seed from '@/lib/seed';

export async function GET() {
  try {
    seed();
    return new Response(JSON.stringify({ message: 'Seed completato' }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}