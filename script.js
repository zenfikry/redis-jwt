import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Skenario pengujian bertahap (Ramping VUs)
  stages: [
    { duration: '10s', target: 50 },  // Tahap 1: Naik ke 50 Virtual Users (VUs) dalam waktu 10 detik
    { duration: '50s', target: 100 }, // Tahap 2: Naik ke 100 VUs dan pertahankan/berfluktuasi selama 50 detik
    { duration: '10s', target: 0 },   // Tahap 3: Turun kembali ke 0 VUs dalam waktu 10 detik (cool down)
  ],

  // Ambang batas (Thresholds) untuk menentukan apakah tes ini lulus/gagal secara otomatis
  thresholds: {
    http_req_failed: ['rate<0.01'], // Kegagalan request harus kurang dari 1%
    http_req_duration: ['p(95)<200'], // 95% response time harus di bawah 200ms
  },
};

// Fungsi utama yang akan dijalankan oleh setiap Virtual User (VU) secara berulang
export default function () {
  const url = 'http://localhost:8080/api/hello';

  // Konfigurasi params untuk menyisipkan header kustom
  const params = {
    headers: {
      'X-API-TOKEN': '2dbb4cd1-38f4-421d-be2f-e514ae0082ad',
      'Content-Type': 'application/json',
    },
  };

  // Melakukan request GET ke target API
  const response = http.get(url, params);

  // Melakukan verifikasi/asersi terhadap response yang diterima
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}