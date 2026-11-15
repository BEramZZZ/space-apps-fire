
import Papa from "papaparse";

export function parseFirmsCSV(file, satellite) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,

      complete: (results) => {
        const detections = results.data
          .map((row, index) => {
            const latitude = Number(row.latitude);
            const longitude = Number(row.longitude);
            const frp = Number(row.frp);

            const date = String(row.acq_date || "").trim();

            if (
              !Number.isFinite(latitude) ||
              !Number.isFinite(longitude) ||
              latitude < -90 ||
              latitude > 90 ||
              longitude < -180 ||
              longitude > 180 ||
              !/^\d{4}-\d{2}-\d{2}$/.test(date)
            ) {
              return null;
            }

            return {
              id: `${satellite}-${index}`,
              latitude,
              longitude,
              date,
              satellite,
              frp: Number.isFinite(frp) ? frp : null,
              confidence: row.confidence,
              acquisitionTime: row.acq_time,
            };
          })
          .filter(Boolean);

        resolve(detections);
      },

      error: reject,
    });
  });
}
