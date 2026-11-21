const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function removeAllDuplicates() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';

  // Daftar akun yang akan dikeluarkan
  const toRemoveList = [
    // Kelas 11-5 (3 akun @sekolah.id)
    { rombel: 'Kelas 11-5', name: 'AMIRA HUSNA SAFITRI', email: 'amirahusna042_7494@sekolah.id', memberId: 'a94a7419-dc49-4bae-aef6-f8b87d5ad343' },
    { rombel: 'Kelas 11-5', name: 'SHAFINA ADHELINA', email: 'shafinaadhelina_4796@sekolah.id', memberId: '50d08401-02e7-4ca3-a403-a227dd1333bf' },
    { rombel: 'Kelas 11-5', name: 'Tsalatsa Fairuzna Ratih', email: 'tsalatsafairuznaratih_8419@sekolah.id', memberId: '98015654-faa8-4328-beae-1201f058c614' },

    // Kelas 11-6 (1 akun @sekolah.id)
    { rombel: 'Kelas 11-6', name: 'LUCKY AGHA FAEZYA ANGGONO', email: 'sman1tawsiswa602_4585@sekolah.id', memberId: 'bdaa0f06-efb8-48ec-bf44-833e4b2bab36' },

    // Kelas 11-7 (1 akun herdhabayuprasetyo@gmail.com)
    { rombel: 'Kelas 11-7', name: 'HERDHA BAYU PRASETYA', email: 'herdhabayuprasetyo@gmail.com', memberId: '1d87bdf2-58c2-4b91-9f75-23f53098b229' },

    // Kelas 11-8 (18 akun dobel non-resmi)
    { rombel: 'Kelas 11-8', name: 'Ainaya Nurfatchi Riyani Putri', email: 'dindafaradilaaa@gmail.com', memberId: 'de101bdf-f6f2-46f3-a10b-4d9dd0c5b5e8' },
    { rombel: 'Kelas 11-8', name: 'ALVIAN MUHAMMAD AKBAR', email: 'alvianmuhammadakbar_8155@sekolah.id', memberId: '15d5392f-f892-4c15-826d-e7e0098782fe' },
    { rombel: 'Kelas 11-8', name: 'ANISA AYU NURSOFA', email: 'prayogafardhan6@gmail.com', memberId: 'afa38a6d-6063-4938-a0df-f94267dd4ab8' },
    { rombel: 'Kelas 11-8', name: 'Annisa Elvira', email: 'auliasandrina796@gmail.com', memberId: '0cd40190-8b0c-4108-84bd-28ba0bf80acc' },
    { rombel: 'Kelas 11-8', name: 'Belinda Candrawati', email: 'lindawatinirwasita@gmail.com', memberId: '5b5a4e04-abaf-4ef1-8acb-84ceeddb48a4' },
    { rombel: 'Kelas 11-8', name: 'Cantika Agista Rahmadani', email: 'alvianekwan0@gmail.com', memberId: 'd741ed10-cfd8-485a-bdf1-06cdd0f6dcf0' },
    { rombel: 'Kelas 11-8', name: 'Dara Cahyaningrum', email: 'dimasrisqi27@gmail.com', memberId: '5a8649f9-36cc-418e-94a4-7f215eb17bdc' },
    { rombel: 'Kelas 11-8', name: 'DITA APRILIA', email: 'puterikhanayakhoirunnisa@gmail.com', memberId: '3215185b-7daf-4417-8e44-09673de75044' },
    { rombel: 'Kelas 11-8', name: 'Fara Marcellia Syahron', email: 'shyfap4@gmail.com', memberId: 'dbcea0ac-f969-447d-b1eb-8bb5b2d44e43' },
    { rombel: 'Kelas 11-8', name: 'Gesit Arditna', email: 'amrikver@gmail.com', memberId: '5fefca01-6e85-4137-bf3c-b8efc7761806' },
    { rombel: 'Kelas 11-8', name: 'Khoirul Fadillah Akbar', email: 'chaisyarahmadhita@gmail.com', memberId: 'e7652f69-540e-48fa-b51c-38242bf0d515' },
    { rombel: 'Kelas 11-8', name: 'KIRANI OKTAVIA HERMAWAN', email: 'rachelnurfebrianti@gmail.com', memberId: '22d5d06f-52f4-4d77-87bd-235e978aea01' },
    { rombel: 'Kelas 11-8', name: 'MAULANA NUR FATIH AL-FAHREZI', email: 'rafaandameyllano@gmail.com', memberId: '85dd6bbe-6917-4524-a157-7554ab511dfa' },
    { rombel: 'Kelas 11-8', name: 'Muhammad Reyhan Putra Silvian', email: 'syarifhd880@gmail.com', memberId: 'abbedc5f-08a9-420c-902d-bc70b3ec0b7a' },
    { rombel: 'Kelas 11-8', name: 'Revita Anggraeni Puspita', email: 'ssalfanur.23@gmail.com', memberId: '074118f5-0cd2-4c25-9f4a-fe1ab5fd740e' },
    { rombel: 'Kelas 11-8', name: 'RIKY RAHMAT SUKAMTO', email: 'shabrinashalsabillah@gmail.com', memberId: '1fb3e4f5-10e3-428d-b438-7206b2201a49' },
    { rombel: 'Kelas 11-8', name: 'Sherin Destiny Aulia', email: 'sintiawati112200@gmail.com', memberId: '21c20bb5-4679-4f7f-8634-af1d3e8ca24f' },
    { rombel: 'Kelas 11-8', name: 'SHIFA AZZAHRA PUTRI SANTOSO', email: 'dennysaktiawantarwantoro2010@gmail.com', memberId: '23ee9951-f2c9-486d-a27c-7bfe08e96ade' }
  ];

  console.log(`Memulai pengeluaran ${toRemoveList.length} akun dobel dari rombel...`);

  let successCount = 0;
  for (const item of toRemoveList) {
    const payload = {
      t: {
        t: 10, i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10, i: 1,
            p: { k: ['memberId'], v: [{ t: 1, s: item.memberId }] },
            o: 0
          }]
        },
        o: 0
      },
      f: 127, m: []
    };

    try {
      const res = await fetch('https://belajarplus.com/_serverFn/853e20cd5cfe0f8fb6d0e40816ee7a27d414247af74e7978a9be05157e8f8f9e', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'x-school-override': schoolId,
          'x-tsr-serverfn': 'true',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      if (text.includes('"ok"')) {
        successCount++;
        console.log(`[OK ${successCount}/${toRemoveList.length}] Dikeluarkan dari ${item.rombel}: ${item.name} (${item.email})`);
      } else {
        console.error(`[FAIL] ${item.rombel}: ${item.name} (${item.email}) -> ${text}`);
      }
    } catch (e) {
      console.error(`[ERR] ${item.name}: ${e.message}`);
    }

    // Delay 300ms agar server tidak tersedak
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nSelesai! Berhasil mengeluarkan ${successCount} dari ${toRemoveList.length} akun dobel.`);
}

removeAllDuplicates().catch(console.error);

