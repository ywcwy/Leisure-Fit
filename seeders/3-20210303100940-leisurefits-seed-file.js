'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Leisurefits', [{
      id: 1,
      name: 'Cross-Fit',
      categoryId: 31,
      description: 'Cross-Fit，集結了速度、力量、協調性、柔軟度的訓練。訓練內容有舉重、體操、田徑等，內容多變有趣，可以讓你對運動不再那麼感到乏味。項目大多為自由重量的運作，有別於傳統健身比較不易受到器材場替的限制，是現在越來越多人喜歡挑戰自己體能的選項。 Cross-Fit 不只是訓練，有競技趣味的成份，常要追求速度的關係，因此危險係數也較高，比較適合自由重量的動作都已經練到精確的朋友們參與。',
      image: '/images/Cross-Fit(Thu).jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      name: '陡坡，是折磨，也是成就',
      categoryId: 41,
      description: '其實爬山的人，有大部分都是期待從高處向下俯瞰，那居高臨下的優越感吧。不過通常在剛上山的路程，面對折磨人的陡坡卻是埋頭在樹林裡，不僅沒有宜人的景致，還要不時注意迎面而來的樹枝劃破你的臉頰，那種心情就像是平時被困在都市叢林掙扎生存的我們。',
      image: '/images/Hiking(weekend).jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 21,
      name: '靜與慢',
      categoryId: 1,
      description: '瑜珈的靜與慢所帶來的能量，是一段重置自已的時間，在呼與吸之間回想過去或鋪陳未來，想想自己的生活又做對或做錯了什麼。在你我忙碌的日常裡，放慢卻不放縱，這堂課就像我們的城市綠洲。',
      image: 'https://i.imgur.com/d2BIvIU.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 31,
      name: '運動的本質',
      categoryId: 11,
      description: '一群愛運動的人卻只是窩在小小的健身房，總有能量無法釋放的壓抑，且若只是待在那恆溫空調的俱樂部裡訓練，身體會無法去適應上山那樣忽冷忽熱的天氣，反而加速體能的流失。運動，應該要讓我們更能體會腳踩在這塊土地的輕快感。',
      image: '/images/Outdoor(Tue).jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 41,
      name: '女性限定',
      categoryId: 21,
      description: '每次練完，妳們總是碎嘴太累，但卻又每週三準時出現，且一次比一次地更有自信地越穿越辣。',
      image: '/images/Girls-only(Wed).jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Leisurefits', null, {})
  }
};
