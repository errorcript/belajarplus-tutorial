const docx = require('docx');
const fs = require('fs');
const path = require('path');

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel, AlignmentType } = docx;

async function generateDocx() {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 }
        }
      },
      children: [
        // Judul Utama
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI", bold: true, size: 20 }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "PLATFORM CBT & LEMBAR JAWAB DIGITAL (LJD) BELAJARPLUS", bold: true, size: 24, color: "107C41" }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "TEMPLATE RESMI PENYUSUNAN BUTIR SOAL & ASESMEN GURU (FORMAT WORD .DOCX)", bold: true, size: 20 }),
          ]
        }),

        // Garis Pembatas
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "=================================================================================", color: "64748B" })
          ]
        }),

        // Metadata Ujian
        new Paragraph({
          children: [
            new TextRun({ text: "A. INFORMASI ASESMEN / UJIAN", bold: true, size: 22, color: "0F172A" })
          ]
        }),
        new Paragraph({ children: [new TextRun({ text: "• Satuan Pendidikan : SMA / MA Mitra BelajarPlus", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "• Mata Pelajaran   : ................................................................", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "• Kelas / Fase      : Kelas X / XI / XII (Fase E / F)", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "• Jenis Asesmen    : Asesmen Formatif / STS / SAS / Tryout CBT", size: 20 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "• Alokasi Waktu     : 90 Menit", size: 20 })] }),

        // Petunjuk Pengisian
        new Paragraph({
          children: [
            new TextRun({ text: "B. PETUNJUK FORMAT PENULISAN SOAL", bold: true, size: 22, color: "0F172A" })
          ]
        }),
        new Paragraph({ children: [new TextRun({ text: "1. Tipe Soal yang didukung: MCQ (Pilihan Ganda), MCMA (Pilihan Kompleks), PGK (Benar/Salah), MATCH (Menjodohkan), ESSAY (Uraian AI), UPLOAD (Berkas <= 10MB).", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "2. Rumus matematika dan reaksi kimia wajib diapit tanda dollar: $f(x) = \\frac{a}{b}$ atau $\\text{H}_2\\text{O}$.", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "3. Kunci jawaban: MCQ (satu huruf), MCMA (A,C,E), PGK (B;S;B), MATCH (1-B;2-A;3-C).", size: 19 })] }),
        new Paragraph({ spacing: { after: 250 }, children: [new TextRun({ text: "4. Bobot skor wajib bilangan bulat integer (1, 2, 3, 5, 10).", size: 19 })] }),

        // Bank Butir Soal
        new Paragraph({
          children: [
            new TextRun({ text: "C. BANK BUTIR SOAL STANDAR KURIKULUM MERDEKA", bold: true, size: 22, color: "0F172A" })
          ]
        }),

        // Soal 1: MCQ
        new Paragraph({ children: [new TextRun({ text: "[SOAL 1] - Tipe: MCQ | Bobot: 1 Poin | Kunci: B", bold: true, color: "1D4ED8", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "Pertanyaan: Organel sel yang berperan sebagai tempat berlangsungnya respirasi seluler untuk menghasilkan energi (ATP) adalah...", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "A. Ribosom", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "B. Mitokondria [KUNCI]", bold: true, color: "15803D", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "C. Badan Golgi", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "D. Retikulum Endoplasma", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "E. Lisosom", size: 19 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Pembahasan: Mitokondria memproduksi ATP seluler aerob.", italic: true, size: 18, color: "475569" })] }),

        // Soal 2: MCMA
        new Paragraph({ children: [new TextRun({ text: "[SOAL 2] - Tipe: MCMA (Pilihan Kompleks) | Bobot: 3 Poin | Kunci: A,C,E", bold: true, color: "B45309", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "Pertanyaan: Manakah di antara peristiwa berikut yang merupakan perubahan fisika? (Pilih semua yang benar)", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "[X] A. Es batu mencair di suhu ruang [KUNCI]", bold: true, color: "15803D", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "[ ] B. Besi pagar rumah mengalami perkaratan", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "[X] C. Pelarutan sendok gula ke dalam teh hangat [KUNCI]", bold: true, color: "15803D", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "[ ] D. Kertas buku terbakar menjadi abu hitam", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "[X] E. Lilin batang meleleh saat sumbu dinyalakan [KUNCI]", bold: true, color: "15803D", size: 19 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Pembahasan: Perubahan fisika tidak menghasilkan zat baru.", italic: true, size: 18, color: "475569" })] }),

        // Soal 3: PGK
        new Paragraph({ children: [new TextRun({ text: "[SOAL 3] - Tipe: PGK (Benar/Salah Matriks) | Bobot: 3 Poin | Kunci: B;S;B", bold: true, color: "4338CA", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "Stimulus: Pemerintah menargetkan bauran EBT mencapai 23% pada 2025 melalui PLTS Atap dan Biofuel.", italic: true, size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "Pernyataan 1: Target bauran EBT 23% ditargetkan tahun 2025 -> [BENAR]", bold: true, color: "15803D", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "Pernyataan 2: Biofuel tidak termasuk pilar EBT nasional -> [SALAH]", bold: true, color: "DC2626", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "Pernyataan 3: PLTS Atap merupakan pilar utama dekarbonisasi -> [BENAR]", bold: true, color: "15803D", size: 19 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Kunci Jawaban Format Impor: B;S;B", bold: true, size: 19 })] }),

        // Soal 4: MATCH
        new Paragraph({ children: [new TextRun({ text: "[SOAL 4] - Tipe: MATCH (Menjodohkan) | Bobot: 4 Poin | Kunci: 1-B;2-A;3-D;4-C", bold: true, color: "BE185D", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "Premis Kiri: 1. Isokhorik | 2. Isobarik | 3. Isotermik | 4. Adiabatik", size: 19 })] }),
        new Paragraph({ children: [new TextRun({ text: "Konsep Kanan: A. Tekanan tetap | B. Volume tetap | C. Q=0 | D. Suhu tetap", size: 19 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Kunci Pasangan: 1-B; 2-A; 3-D; 4-C", bold: true, size: 19 })] }),

        // Soal 5: ESSAY AI
        new Paragraph({ children: [new TextRun({ text: "[SOAL 5] - Tipe: ESSAY (Koreksi Semantik AI) | Bobot: 5 Poin", bold: true, color: "15803D", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "Pertanyaan: Jelaskan dampak deforestasi hulu terhadap siklus hidrologi dan risiko bencana di kawasan hilir!", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "Rubrik Kata Kunci AI: infiltrasi berkurang | limpasan permukaan tinggi | banjir bandang hilir | erosi sedimentasi | kekeringan kemarau", bold: true, color: "047857", size: 19 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Kunci Jawaban Acuan: Infiltrasi air berkurang sehingga limpasan permukaan meningkat drastis, memicu banjir bandang saat musim hujan dan kekeringan air sumur saat kemarau.", size: 19 })] }),

        // Soal 6: UPLOAD
        new Paragraph({ children: [new TextRun({ text: "[SOAL 6] - Tipe: UPLOAD (Praktikum Lembar Kerja) | Bobot: 10 Poin", bold: true, color: "C2410C", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "Instruksi: Unggah laporan akhir praktikum titrasi asam-basa lengkap grafik pH dan foto lembar kerja bertanda tangan! (Format PDF/Word <= 10MB)", size: 20 })] }),
        new Paragraph({ children: [new TextRun({ text: "Kunci Jawaban: [Manual Grading oleh Guru]", bold: true, size: 19 })] })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('template_pembuatan_soal_guru_belajarplus.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Template Word .docx sukses dibuat di:', outputPath);
}

generateDocx();
