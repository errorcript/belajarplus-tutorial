const fs = require('fs');
const cp = require('child_process');

async function main() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  const rawRombels = fs.readFileSync('rombels_raw.json', 'utf8');
  const idMatches = [...rawRombels.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const rombelMap = {};
  for (const m of idMatches) {
    const name = `Kelas ${m[8]}-${m[2]}`;
    rombelMap[name] = m[1];
  }

  const allZeroConflict = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));

  // Ambil semua jadwal live per rombel
  const liveSlotsByRombel = {};
  for (const [rombelName, rombelId] of Object.entries(rombelMap)) {
    const payload = {
      t: {
        t: 10, i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10, i: 1,
            p: {
              k: ['rombelId', 'semesterId'],
              v: [{ t: 1, s: rombelId }, { t: 1, s: semesterId }]
            },
            o: 0
          }]
        },
        o: 0
      },
      f: 127, m: []
    };

    fs.writeFileSync('temp_q.json', JSON.stringify(payload));
    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/da25c6d4221aa4f4fa34bc04bd16f3ea6f8e5a4a597f0d2f45b2674972b8f2db" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" --data-binary "@temp_q.json"`;
    const res = cp.execSync(cmd, { encoding: 'utf8' });

    // Parse slots dari response Seroval
    // Pola slot di Seroval:
    // "id","end","start","active","classId","className","dayOfWeek","subjectId","teacherId","subjectName","teacherName","activityLabel"
    // Mari kita ekstrak dayOfWeek, start, end
    // Atau regex: /\{"t":1,"s":"([0-9a-f-]{36})"\},"([0-9]{2}:[0-9]{2})","([0-9]{2}:[0-9]{2})"/
    const slots = [];
    const itemRegex = /"end","start"[\s\S]*?\{"t":1,"s":"([0-9]{2}:[0-9]{2})"\}\s*,\s*\{"t":1,"s":"([0-9]{2}:[0-9]{2})"\}[\s\S]*?"dayOfWeek"[\s\S]*?\{"t":0,"s":(\d+)\}/g;
    let match;
    while ((match = itemRegex.exec(res)) !== null) {
      slots.push({
        end: match[1],
        start: match[2],
        dayOfWeek: parseInt(match[3])
      });
    }
    // Jika regex di atas tidak catch semua, kita coba pola spesifik seroval
    liveSlotsByRombel[rombelName] = { rawLength: res.length, count: slots.length, slots, raw: res };
  }

  // Mari kita cek parsing rombel pertama
  console.log('Sample parsed slots for Kelas 10-1: count =', liveSlotsByRombel['Kelas 10-1']?.count);
  fs.writeFileSync('sample_serverfn_response_10_1.txt', liveSlotsByRombel['Kelas 10-1']?.raw || '');
}

main().catch(console.error);

