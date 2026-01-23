import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 30個導向首頁的短連結
const homepageLinks = [
  { slug: 'fb1', url: '/', title: 'Facebook 廣告 1', description: 'Facebook 廣告活動 - 系列 A' },
  { slug: 'fb2', url: '/', title: 'Facebook 廣告 2', description: 'Facebook 廣告活動 - 系列 B' },
  { slug: 'ig1', url: '/', title: 'Instagram 限動 1', description: 'Instagram 限時動態 - 早安' },
  { slug: 'ig2', url: '/', title: 'Instagram 限動 2', description: 'Instagram 限時動態 - 午安' },
  { slug: 'ig3', url: '/', title: 'Instagram 貼文 1', description: 'Instagram 貼文 - 專案展示' },
  { slug: 'yt1', url: '/', title: 'YouTube 影片描述', description: 'YouTube 影片說明欄連結' },
  { slug: 'yt2', url: '/', title: 'YouTube 社群貼文', description: 'YouTube 社群分享' },
  { slug: 'line1', url: '/', title: 'LINE 官方帳號', description: 'LINE 官方帳號分享' },
  { slug: 'line2', url: '/', title: 'LINE 群組 1', description: 'LINE 社群群組連結' },
  { slug: 'tw1', url: '/', title: 'Twitter 推文 1', description: 'Twitter 專案分享' },
  { slug: 'tw2', url: '/', title: 'Twitter 推文 2', description: 'Twitter 個人簡介' },
  { slug: 'email1', url: '/', title: '電子報連結 1', description: '電子報簽名檔' },
  { slug: 'email2', url: '/', title: '電子報連結 2', description: '電子報內容連結' },
  { slug: 'bio', url: '/', title: '個人簡介連結', description: '社交媒體個人簡介' },
  { slug: 'card', url: '/', title: '名片 QR Code', description: '個人名片連結' },
  { slug: 'resume1', url: '/', title: '履歷連結 1', description: '履歷個人網站連結' },
  { slug: 'resume2', url: '/', title: '履歷連結 2', description: '履歷作品集連結' },
  { slug: 'ptt', url: '/', title: 'PTT 簽名檔', description: 'PTT 簽名檔連結' },
  { slug: 'dcard', url: '/', title: 'Dcard 簽名', description: 'Dcard 個人簽名' },
  { slug: 'meetup', url: '/', title: 'Meetup 活動', description: 'Meetup 活動頁面' },
  { slug: 'conf', url: '/', title: '研討會簡報', description: '研討會簡報連結' },
  { slug: 'qr1', url: '/', title: 'QR Code 1', description: '活動 QR Code - A' },
  { slug: 'qr2', url: '/', title: 'QR Code 2', description: '活動 QR Code - B' },
  { slug: 'qr3', url: '/', title: 'QR Code 3', description: '活動 QR Code - C' },
  { slug: 'poster', url: '/', title: '海報連結', description: '實體海報 QR Code' },
  { slug: 'flyer', url: '/', title: '傳單連結', description: '宣傳傳單連結' },
  { slug: 'booth', url: '/', title: '攤位連結', description: '展覽攤位 QR Code' },
  { slug: 'tag1', url: '/', title: '標籤連結 1', description: 'UTM 追蹤 - 來源 A' },
  { slug: 'tag2', url: '/', title: '標籤連結 2', description: 'UTM 追蹤 - 來源 B' },
  { slug: 'tag3', url: '/', title: '標籤連結 3', description: 'UTM 追蹤 - 來源 C' },
]

async function main() {
  console.log('開始創建30個導向首頁的追蹤連結...')

  for (const link of homepageLinks) {
    const existing = await prisma.trackedLink.findUnique({
      where: { slug: link.slug }
    })

    if (!existing) {
      await prisma.trackedLink.create({
        data: link
      })
      console.log(`✓ 創建連結: ${link.slug} - ${link.title}`)
    } else {
      await prisma.trackedLink.update({
        where: { slug: link.slug },
        data: {
          url: link.url,
          title: link.title,
          description: link.description,
        }
      })
      console.log(`↻ 更新連結: ${link.slug} - ${link.title}`)
    }
  }

  console.log('\n完成！已創建/更新 30 個追蹤連結')
  console.log('\n範例使用方式：')
  console.log('- http://你的網域/l/fb1')
  console.log('- http://你的網域/l/ig1')
  console.log('- http://你的網域/l/qr1')
  console.log('\n這些連結都會導向首頁，並記錄點擊數據！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
