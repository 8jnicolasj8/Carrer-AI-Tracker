import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { CareerDataReader } from '../src/data/reader';

describe('Read-Only Data Isolation Guarantee (Section 9)', () => {
  it('strictly performs read-only operations and leaves directory files untouched', () => {
    const fixturesDir = path.resolve(__dirname, '../../../fixtures');
    expect(fs.existsSync(fixturesDir)).toBe(true);

    // Record mtimes of files before reading
    const files = fs.readdirSync(fixturesDir);
    const mtimesBefore = new Map<string, number>();

    for (const f of files) {
      const fullPath = path.join(fixturesDir, f);
      const stat = fs.statSync(fullPath);
      mtimesBefore.set(f, stat.mtimeMs);
    }

    // Perform comprehensive data read
    const reader = new CareerDataReader(fixturesDir);
    const data = reader.loadAll();

    expect(data.matches.length).toBeGreaterThan(0);
    expect(data.news.length).toBeGreaterThan(0);

    // Verify mtimes did not change and no new files were created
    const filesAfter = fs.readdirSync(fixturesDir);
    expect(filesAfter.length).toBe(files.length);

    for (const f of filesAfter) {
      const fullPath = path.join(fixturesDir, f);
      const stat = fs.statSync(fullPath);
      expect(stat.mtimeMs).toBe(mtimesBefore.get(f));
    }
  });

  it('skips invalid JSONL lines with diagnostics without corrupting data source', () => {
    // Create temporary test dir
    const tempDir = path.resolve(__dirname, 'temp-readonly-test');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const testFile = path.join(tempDir, 'partidos.jsonl');
    const validLine = JSON.stringify({
      tipo: 'partido',
      fecha_juego: '2025-01-01',
      rival_nombre: 'Rival FC',
      goles_club: 1,
      goles_rival: 0,
      resultado: 'G',
      partidos_en_delta: 1,
      local_visitante: 'local',
      fecha_simulada: '2025-01-02',
    });
    const brokenLine = '{"tipo": "partido", "incomplet... broken json';

    fs.writeFileSync(testFile, `${validLine}\n${brokenLine}\n${validLine}\n`, 'utf-8');

    const reader = new CareerDataReader(tempDir);
    const data = reader.loadAll();

    expect(data.matches.length).toBe(2);
    expect(data.diagnostics.invalidLinesSkipped).toBe(1);
    expect(data.diagnostics.warnings.length).toBeGreaterThan(0);

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
