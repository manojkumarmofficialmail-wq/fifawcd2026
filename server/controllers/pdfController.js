const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../db');

// Palette to match the app
const INK = '#0A1A2F';
const GOLD = '#F5B700';
const PINK = '#E63E8C';
const GREEN = '#12B886';
const MUTED = '#5B6B7B';
const LINE = '#D8DEE6';

// Look for a real logo dropped into server/assets (logo.png / .jpg / .jpeg).
// PDFKit supports PNG and JPEG. SVG is not supported here.
function findLogoFile() {
  const dir = path.join(__dirname, '..', 'assets');
  for (const name of ['logo.png', 'logo.jpg', 'logo.jpeg']) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// Draws the logo into a box of side 2*r at (x,y): real image if present,
// otherwise the placeholder mark.
function placeLogo(doc, x, y, r) {
  const file = findLogoFile();
  if (file) {
    try {
      doc.image(file, x, y, { fit: [2 * r, 2 * r], align: 'center', valign: 'center' });
      return;
    } catch (e) {
      // fall through to placeholder if the image can't be read
    }
  }
  drawLogo(doc, x, y, r);
}

function drawLogo(doc, x, y, r) {
  // Simple WCD logo placeholder: a gold ring with a pink heart-in-shield mark.
  doc.save();
  doc.circle(x + r, y + r, r).lineWidth(3).stroke(GOLD);
  doc.circle(x + r, y + r, r - 6).lineWidth(1.5).stroke(PINK);
  doc
    .fontSize(r * 0.9)
    .fillColor(PINK)
    .text('♥', x + r - r * 0.32, y + r - r * 0.62);
  doc.restore();
}

// GET /api/pdf/daily-report   (streams a PDF download)
async function dailyReport(req, res) {
  try {
    // Pull active participants grouped by team (notice board = who is still in).
    const teamsRes = await db.query(
      `SELECT t.name, t.flag, t.is_eliminated,
              COUNT(u.id) FILTER (WHERE u.status='active') AS active_count
       FROM teams t
       LEFT JOIN users u ON u.team = t.name
       GROUP BY t.id
       HAVING COUNT(u.id) > 0
       ORDER BY t.is_eliminated ASC, active_count DESC, t.name ASC`
    );

    const usersRes = await db.query(
      `SELECT full_name, designation, section, team, status
       FROM users
       ORDER BY team ASC, full_name ASC`
    );

    const totalsRes = await db.query(
      `SELECT COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status='active') AS remaining
       FROM users`
    );
    const total = Number(totalsRes.rows[0].total);
    const remaining = Number(totalsRes.rows[0].remaining);

    // Group users by team for the listing
    const byTeam = {};
    for (const u of usersRes.rows) {
      (byTeam[u.team] = byTeam[u.team] || []).push(u);
    }

    const today = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // ---- Stream setup ----
    const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: true });
    const filename = `WCD-WorldCup2026-DailyReport-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    doc.pipe(res);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const left = doc.page.margins.left;

    // ---- Header band ----
    doc.rect(0, 0, doc.page.width, 96).fill(INK);
    placeLogo(doc, left, 22, 26);
    doc
      .fillColor(GOLD)
      .font('Helvetica-Bold')
      .fontSize(16)
      .text('Women and Child Welfare Committee', left + 70, 28, { width: pageWidth - 70 });
    doc
      .fillColor('#FFFFFF')
      .font('Helvetica')
      .fontSize(11)
      .text('Directorate of Women and Child Development Department', left + 70, 50, {
        width: pageWidth - 70,
      });
    doc
      .fillColor(PINK)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text('FIFA World Cup 2026 — Prediction Contest', left + 70, 68, {
        width: pageWidth - 70,
      });

    doc.y = 116;

    // ---- Title + date ----
    doc
      .fillColor(INK)
      .font('Helvetica-Bold')
      .fontSize(18)
      .text('Daily Status Report', left, doc.y);
    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(11)
      .text(today, left, doc.y + 2);

    doc.moveDown(0.6);

    // ---- Summary chips ----
    const chipY = doc.y;
    const chipW = (pageWidth - 20) / 3;
    const chips = [
      { label: 'Total participants', value: String(total), color: INK },
      { label: 'Still in contest', value: String(remaining), color: GREEN },
      { label: 'Eliminated', value: String(total - remaining), color: PINK },
    ];
    chips.forEach((c, i) => {
      const x = left + i * (chipW + 10);
      doc.roundedRect(x, chipY, chipW, 50, 8).fill('#F3F5F8');
      doc.fillColor(c.color).font('Helvetica-Bold').fontSize(22).text(c.value, x + 12, chipY + 8);
      doc.fillColor(MUTED).font('Helvetica').fontSize(9).text(c.label.toUpperCase(), x + 12, chipY + 34);
    });
    doc.y = chipY + 66;

    // ---- Team sections ----
    const printableTeams = teamsRes.rows;
    for (const t of printableTeams) {
      const members = byTeam[t.name] || [];
      const active = members.filter((m) => m.status === 'active');

      // Section header bar
      if (doc.y > doc.page.height - 120) doc.addPage();
      const barY = doc.y;
      doc.roundedRect(left, barY, pageWidth, 26, 6).fill(t.is_eliminated ? '#FBE9F1' : '#E7F8F1');
      doc
        .fillColor(t.is_eliminated ? PINK : '#0B6E4F')
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(
          `${t.name}${t.is_eliminated ? '  — ELIMINATED' : ''}`,
          left + 10,
          barY + 7
        );
      doc
        .fillColor(MUTED)
        .font('Helvetica')
        .fontSize(10)
        .text(`${active.length} active`, left, barY + 8, { width: pageWidth - 12, align: 'right' });
      doc.y = barY + 34;

      // Member rows
      doc.font('Helvetica').fontSize(10).fillColor(INK);
      const rows = t.is_eliminated ? members : active.length ? active : members;
      if (rows.length === 0) {
        doc.fillColor(MUTED).text('No participants.', left + 12, doc.y);
        doc.moveDown(0.4);
      }
      rows.forEach((m, idx) => {
        if (doc.y > doc.page.height - 60) doc.addPage();
        const rowY = doc.y;
        doc.fillColor(MUTED).fontSize(9).text(String(idx + 1).padStart(2, '0'), left + 8, rowY, { width: 22 });
        doc
          .fillColor(m.status === 'eliminated' ? MUTED : INK)
          .fontSize(10)
          .text(m.full_name, left + 34, rowY, { width: 180, continued: false });
        doc.fillColor(MUTED).fontSize(9).text(m.designation, left + 220, rowY, { width: 150 });
        doc.fillColor(MUTED).fontSize(9).text(m.section, left + 372, rowY, { width: pageWidth - 372 });
        doc.y = rowY + 16;
        doc.moveTo(left + 8, doc.y - 3).lineTo(left + pageWidth - 8, doc.y - 3).lineWidth(0.5).stroke(LINE);
      });
      doc.moveDown(0.6);
    }

    // ---- Footer on every page ----
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc
        .fillColor(MUTED)
        .font('Helvetica')
        .fontSize(8)
        .text(
          `Generated for notice-board display • Women and Child Development Department • Page ${
            i - range.start + 1
          } of ${range.count}`,
          left,
          doc.page.height - 40,
          { width: pageWidth, align: 'center' }
        );
    }

    doc.end();
  } catch (err) {
    console.error('dailyReport error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Could not generate the report.' });
    } else {
      res.end();
    }
  }
}

module.exports = { dailyReport };
