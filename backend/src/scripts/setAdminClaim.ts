import 'dotenv/config';
import { auth } from '../config/firebase';

async function main() {
  const uid = process.argv[2];
  if (!uid) {
    console.error('Uso: npm run set-admin -- <uid>');
    process.exit(1);
  }

  await auth.setCustomUserClaims(uid, { admin: true });
  console.log(`Listo: ${uid} ahora tiene el custom claim admin=true.`);
  console.log('El usuario debe cerrar sesión y volver a entrar para que el token refleje el nuevo claim.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
