export default {
  modules: {
    development: {
      // Number of simulation cycles it takes to build a building
      // Số vòng lặp cần thiết để hoàn thành xây dựng và chuyển sang developed.
      constructionTime: 3,
      // Probability of a building leveling up
      //ác suất một khu vực phát triển nâng cấp nếu nó chưa đạt mức độ tối đa.
      levelUpChance: 0.025,
      // Probability of building being re-developed after it is no longer
      // meeting the abandonment criteria
      //Xác suất chuyển từ undeveloped hoặc abandoned sang underConstruction hoặc developed
      redevelopChance: 0.25,         
    },
  },
  vehicle: {
    // The distance travelled per millisecond
    speed: 0.0005,            
    // The start/end time where the vehicle should fade
    fadeTime: 500,  
    // Maximum lifetime of a vehicle (controls max # of vehicles on screen)     
    maxLifetime: 10000,
    // How often vehicles are spawned in milliseconds
    spawnInterval: 1000     
  },
}
