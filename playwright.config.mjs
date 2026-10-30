import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',
 testMatch:['v14-browser.spec.mjs','v15-browser.spec.mjs','v16-browser.spec.mjs'],
 timeout:45000,
 expect:{timeout:12000},
 fullyParallel:false,
 retries:process.env.CI?1:0,
 reporter:[['list'],['html',{outputFolder:'playwright-report',open:'never'}]],
 use:{baseURL:'http://127.0.0.1:8765',trace:'retain-on-failure',screenshot:'only-on-failure',...devices['Desktop Chrome']},
 webServer:{command:'python3 -m http.server 8765 --bind 127.0.0.1',url:'http://127.0.0.1:8765/',reuseExistingServer:!process.env.CI,timeout:30000}
});
