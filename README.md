# Twitch Bot By Techcast feat. Inorin

## Installation

1. Click install.bat
2. Setup Configuration in .env

## Running Bot

Just Click start.bat

## Commands and Details

- Get Status
  - ขอ status ตัวละคร
- Buy Weapon
  - ซื้ออาวุธ
  - สูงสุดที่ 20 coin
  - จำนวนวันในการใช้งาน = coin / 4 ปัดขึ้น
    - ต่ำกว่า 4 coin ใช้ได้ 1 วัน
    - ต่ำกว่า 5 - 8 coin ใช้ได้ 2 วัน
    - สูงสุดคือ 5 วัน
- Attack Player
  - โจมตี player
  - ถ้าคนถูกตีมี dmg ต่ำกว่า หรือ เท่ากัน จะโดน 100%
    - คนกระจอกกว่า ก็โดนตีชัวร์ หรือ เก่งเท่ากัน โดนตีก่อนก็ตายชัวร์
  - ถ้าคนถูกตีมี dmg มากกว่า
    - ดูว่า dmg มากกว่ากี่เท่า
    - attacked / attacker = เก่งกว่า x เท่า
    - โอกาสที่จะตีสำเร็จคือ 100 / x %
      - เช่นเก่งกว่า 4 เท่าก็มีโอกาสตีสำเร็จ 25%
    - คนเก่งก็ต้องชนะ แต่ก็มีวันแพ้ถ้าประมาท
- Attack Boss
  - ตีบอส
  - top 5 จะได้ coin พิเศษ

# Web UI

- boss (localhost:8080/boss)
- feed (localhost:8080/feed)
