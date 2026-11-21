const fs = require('fs');

async function listAccountsToRemove() {
  const allMembers = JSON.parse(fs.readFileSync('tws_all_rombel_active_members.json', 'utf8'));

  const toRemove = [];

  // 1. Kelas 11-4: Fadhil Muhammad Mahardika
  const r11_4 = allMembers['Kelas 11-4'];
  const fadhil = r11_4.members.find(m => m.name.toLowerCase().includes('fadhil') && m.name.toLowerCase().includes('mahardika'));
  if (fadhil) {
    toRemove.push({
      rombel: 'Kelas 11-4',
      name: fadhil.name,
      email: fadhil.email,
      memberId: fadhil.id,
      reason: 'Bukan anggota 11-4 (merah di excel 11-10)'
    });
  }

  // 2. Kelas 11-5: 3 akun @sekolah.id
  const r11_5 = allMembers['Kelas 11-5'];
  const emails11_5 = [
    'amirahusna042_7494@sekolah.id',
    'shafinaadhelina_4796@sekolah.id',
    'tsalatsafairuznaratih_8419@sekolah.id'
  ];
  r11_5.members.filter(m => emails11_5.includes(m.email.toLowerCase())).forEach(m => {
    toRemove.push({
      rombel: 'Kelas 11-5',
      name: m.name,
      email: m.email,
      memberId: m.id,
      reason: 'Akun dobel (resmi: @belajarplus.com)'
    });
  });

  // 3. Kelas 11-6: 1 akun @sekolah.id
  const r11_6 = allMembers['Kelas 11-6'];
  const lucky = r11_6.members.find(m => m.email.toLowerCase() === 'sman1tawsiswa602_4585@sekolah.id');
  if (lucky) {
    toRemove.push({
      rombel: 'Kelas 11-6',
      name: lucky.name,
      email: lucky.email,
      memberId: lucky.id,
      reason: 'Akun dobel (resmi: sman1taw_siswa602@belajarplus.com)'
    });
  }

  // 4. Kelas 11-7: herdhabayuprasetyo@gmail.com
  const r11_7 = allMembers['Kelas 11-7'];
  const herdhaGmail = r11_7.members.find(m => m.email.toLowerCase() === 'herdhabayuprasetyo@gmail.com');
  if (herdhaGmail) {
    toRemove.push({
      rombel: 'Kelas 11-7',
      name: herdhaGmail.name,
      email: herdhaGmail.email,
      memberId: herdhaGmail.id,
      reason: 'Akun dobel (resmi: sman1taw_siswa622@belajarplus.com)'
    });
  }

  // 5. Kelas 11-8: 18 akun dobel non-resmi
  const r11_8 = allMembers['Kelas 11-8'];
  // Di target Excel 11-8, semua akun resmi berakhiran @belajarplus.com (sman1taw_siswa640 s/d 674)
  // Akun dobel adalah akun yang BUKAN @belajarplus.com
  r11_8.members.filter(m => !m.email.toLowerCase().endsWith('@belajarplus.com')).forEach(m => {
    toRemove.push({
      rombel: 'Kelas 11-8',
      name: m.name,
      email: m.email,
      memberId: m.id,
      reason: 'Akun dobel non-resmi (resmi: @belajarplus.com)'
    });
  });

  console.log(`=== TOTAL AKUN YANG PERLU DIKELUARKAN DARI ROMBEL: ${toRemove.length} ===`);
  console.table(toRemove);

  fs.writeFileSync('tws_accounts_to_remove.json', JSON.stringify(toRemove, null, 2));
}

listAccountsToRemove().catch(console.error);

