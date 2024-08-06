import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 users
    { duration: '1m', target: 10 },  // Stay at 10 users for 1 minute
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
};

export default function () {
  let url = 'http://localhost:8080/employee-management-system/v1/auth/login';
  let payload = JSON.stringify({
    phone: '01114911898',
    password: 'Password@1230!',
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);
  check(res, {
    'is status 200': (r) => r.status === 200,
    'is accessToken present': (r) => JSON.parse(r.body).data !== undefined,
  });

  sleep(1);
}
