import * as THREE from 'three';

const createJitteredSphere = (radius, widthSegments, heightSegments, x, y, z, jitterAmount) => {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments); 
  
    // Jitter các đỉnh
    // const positions = geometry.attributes.position.array;
    // for (let i = 0; i < positions.length; i += 3) {
    //   positions[i] += (Math.random() - 0.5) * jitterAmount;
    //   positions[i + 1] += (Math.random() - 0.5) * jitterAmount;
    //   positions[i + 2] += (Math.random() - 0.5) * jitterAmount;
    // }
    // geometry.attributes.position.needsUpdate = true;
  
    // Tạo mesh từ geometry và material flat-shaded
    const material = new THREE.MeshLambertMaterial({
      color: 'white',
      flatShading: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
  
    return sphere;
  };

// Hàm tạo đám mây
const createCloud = (x, y, z) => {
    const cloudGroup = new THREE.Group();
    const jitterAmount = 0.2;
    const sphere1 = createJitteredSphere(1.5, 7, 8, -2, 10, 0, jitterAmount); 
    const sphere2 = createJitteredSphere(1.5, 7, 8, 2, 10, 0, jitterAmount);
    const sphere3 = createJitteredSphere(2.0, 7, 8, 0, 10, 0, jitterAmount);
  
    cloudGroup.add(sphere1);
    cloudGroup.add(sphere2);
    cloudGroup.add(sphere3);
    cloudGroup.position.set(x, y, z);
  
    return cloudGroup;
  };

// Hàm khởi tạo các đám mây và thêm vào scene
export function initClouds(scene) {
  const clouds = [];
  const cloudCount = 50; // Số lượng đám mây
  const cloudSeparationX = 120; // Khoảng cách giữa các đám mây trên trục x
  const cloudSeparationZ = 120; // Khoảng cách giữa các đám mây trên trục z
  const yOffset = 10; 

  for (let i = 0; i < cloudCount; i++) {
    const x = Math.random() * cloudSeparationX - cloudSeparationX / 2;
    const y = yOffset + Math.random() * 10 - 5;
    const z = Math.random() * cloudSeparationZ - cloudSeparationZ / 2; // 
    const cloud = createCloud(x, y, z);
    clouds.push(cloud);
    scene.add(cloud);
  }
  return clouds;
}

// Hàm animate các đám mây
export function animateClouds(clouds) {
    clouds.forEach(cloud => {
      cloud.position.x += 0.1; 
      cloud.position.y = Math.sin(cloud.position.x * 0.5); 
      if (cloud.position.x > 70) {
        cloud.position.x = -50;
      }
    });
  }