// pages/index.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [songs, setSongs] = useState<any[]>([]);
  const [filters, setFilters] = useState({ bpmMin: 0, bpmMax: 200, energiaMin: 0, energiaMax: 10 });

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from("canciones")
      .select("*")
      .gte("bpm", filters.bpmMin)
      .lte("bpm", filters.bpmMax)
      .gte("energia", filters.energiaMin)
      .lte("energia", filters.energiaMax);

    if (!error) setSongs(data);
    else console.error(error);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(songs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "playlist.csv");
  };

  const exportM3U = () => {
    const content = songs.map((s) => s.ruta).join("\n");
    const blob = new Blob([content], { type: "audio/x-mpegurl" });
    saveAs(blob, "playlist.m3u");
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">🎶 Generador de Playlists</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>BPM Mínimo</label>
          <input type="number" value={filters.bpmMin} onChange={e => setFilters({ ...filters, bpmMin: +e.target.value })} className="w-full border p-1" />
        </div>
        <div>
          <label>BPM Máximo</label>
          <input type="number" value={filters.bpmMax} onChange={e => setFilters({ ...filters, bpmMax: +e.target.value })} className="w-full border p-1" />
        </div>
        <div>
          <label>Energía Mínima</label>
          <input type="number" value={filters.energiaMin} onChange={e => setFilters({ ...filters, energiaMin: +e.target.value })} className="w-full border p-1" />
        </div>
        <div>
          <label>Energía Máxima</label>
          <input type="number" value={filters.energiaMax} onChange={e => setFilters({ ...filters, energiaMax: +e.target.value })} className="w-full border p-1" />
        </div>
      </div>

      <button onClick={fetchSongs} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Buscar</button>
      <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded mr-2">Exportar CSV</button>
      <button onClick={exportM3U} className="bg-purple-600 text-white px-4 py-2 rounded">Exportar M3U</button>

      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Título</th>
            <th className="border p-2">Artista</th>
            <th className="border p-2">BPM</th>
            <th className="border p-2">Energía</th>
            <th className="border p-2">Ruta</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, idx) => (
            <tr key={idx} className="border">
              <td className="p-2">{song.titulo}</td>
              <td className="p-2">{song.artista}</td>
              <td className="p-2">{song.bpm}</td>
              <td className="p-2">{song.energia}</td>
              <td className="p-2 truncate max-w-[300px]">{song.ruta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
