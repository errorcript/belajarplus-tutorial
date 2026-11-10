const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function testAllLogins() {
  const apikey = 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U';
  
  // 1. Baca data guru dari drive
  const rawDrive = JSON.parse(fs.readFileSync('tws_drive_raw_guru.json', 'utf8'));
  // Filter header
  const driveTeachers = rawDrive.slice(1).map(r => ({
    name: (r.A || '').replace(/&apos;/g, "'").trim(),
    email: (r.B || '').trim().toLowerCase(),
    password: (r.C || '').trim(),
    role: (r.D || '').trim()
  })).filter(t => t.email && t.email.includes('@'));

  console.log(`Loaded ${driveTeachers.length} teachers from Drive`);

  // 2. Baca data live dari platform
  const liveStaff = JSON.parse(fs.readFileSync('tws_live_staff.json', 'utf8'));
  const liveMap = new Map();
  for (const s of liveStaff) {
    liveMap.set((s.email || '').toLowerCase().trim(), s);
  }

  console.log(`Loaded ${liveStaff.length} live staff from Platform`);

  // 3. Test login 1 per 1
  const results = [];
  console.log('Starting 1-by-1 login testing...');

  for (let i = 0; i < driveTeachers.length; i++) {
    const t = driveTeachers[i];
    const liveObj = liveMap.get(t.email);
    const inPlatform = !!liveObj;

    let loginStatus = 'UNKNOWN';
    let loginMessage = '';
    let tokenAcquired = false;

    // Coba login dengan password dari file drive
    try {
      const res = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: {
          'apikey': apikey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: t.email,
          password: t.password
        })
      });

      const data = await res.json();
      if (res.status === 200 && data.access_token) {
        loginStatus = 'SUCCESS';
        loginMessage = 'Berhasil login (Token valid)';
        tokenAcquired = true;
      } else {
        loginStatus = 'FAILED';
        loginMessage = data.error_description || data.msg || `HTTP ${res.status}: ${JSON.stringify(data)}`;
      }
    } catch (err) {
      loginStatus = 'ERROR';
      loginMessage = err.message;
    }

    const itemResult = {
      no: i + 1,
      name: t.name,
      email: t.email,
      password: t.password,
      inPlatform: inPlatform,
      platformStatus: liveObj ? liveObj.status : 'BELUM TERDAFTAR',
      platformRoles: liveObj ? liveObj.roles : [],
      platformUserId: liveObj ? liveObj.user_id : null,
      loginStatus: loginStatus,
      loginMessage: loginMessage
    };

    results.push(itemResult);

    const icon = loginStatus === 'SUCCESS' ? '✅' : '❌';
    console.log(`[${(i + 1).toString().padStart(2)}/${driveTeachers.length}] ${icon} ${t.name.padEnd(35)} | ${t.email.padEnd(35)} | In Platform: ${inPlatform ? 'YA' : 'TIDAK'} | Login: ${loginStatus}`);

    // Delay 150ms agar tidak terkena rate limit
    await new Promise(r => setTimeout(r, 150));
  }

  // Cek juga staf yang ada di live platform tapi TIDAK ada di file excel Drive
  const driveEmails = new Set(driveTeachers.map(t => t.email));
  const extraInPlatform = [];
  for (const s of liveStaff) {
    const em = (s.email || '').toLowerCase().trim();
    if (!driveEmails.has(em)) {
      extraInPlatform.push({
        name: s.full_name,
        email: em,
        roles: s.roles,
        status: s.status,
        user_id: s.user_id
      });
    }
  }

  console.log(`\n=== REKAP TESTING LOGIN PTK SMAN 1 TAWANGSARI ===`);
  const successCount = results.filter(r => r.loginStatus === 'SUCCESS').length;
  const failedCount = results.filter(r => r.loginStatus === 'FAILED').length;
  const inPlatformCount = results.filter(r => r.inPlatform).length;
  const notInPlatformCount = results.filter(r => !r.inPlatform).length;

  console.log(`- Total Guru di Drive       : ${driveTeachers.length}`);
  console.log(`- Terdaftar di Platform     : ${inPlatformCount}`);
  console.log(`- Belum Terdaftar di Platform: ${notInPlatformCount}`);
  console.log(`- BISA LOGIN (Sukses)      : ${successCount}`);
  console.log(`- GAGAL LOGIN               : ${failedCount}`);
  console.log(`- Staf Live Tambahan (bukan dari drive): ${extraInPlatform.length}`);

  const summaryData = {
    schoolName: 'SMA NEGERI 1 TAWANGSARI',
    schoolId: 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21',
    auditTime: new Date().toISOString(),
    totalDriveTeachers: driveTeachers.length,
    totalLivePlatformStaff: liveStaff.length,
    successLogins: successCount,
    failedLogins: failedCount,
    inPlatformCount,
    notInPlatformCount,
    results,
    extraInPlatform
  };

  fs.writeFileSync('tws_audit_results.json', JSON.stringify(summaryData, null, 2));
  console.log('Saved results to tws_audit_results.json');
}

testAllLogins().catch(console.error);
