import * as mats from '../utils/materials.js';

export function createCircularWaterClarifier(THREE) {
    const materials = mats.materials || mats;
    const group = new THREE.Group();
    const animationClips = [];

    const matConcrete = materials.concrete || new THREE.MeshStandardMaterial({ color: 0x888a85 });
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const matWater = materials.water || new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.7 });

    // Tank
    const tankGeo = new THREE.CylinderGeometry(10, 10, 3, 32, 1, true);
    const tankGeoFloor = new THREE.CylinderGeometry(10, 0.5, 1, 32);
    tankGeoFloor.translate(0, -1.5, 0);
    const tank = new THREE.Mesh(tankGeo, matConcrete);
    const floor = new THREE.Mesh(tankGeoFloor, matConcrete);
    group.add(tank, floor);

    // Water
    const waterGeo = new THREE.CylinderGeometry(9.9, 9.9, 2.5, 32);
    const water = new THREE.Mesh(waterGeo, matWater);
    water.position.y = 0.25;
    group.add(water);

    // Scraper Bridge
    const bridgeGroup = new THREE.Group();
    bridgeGroup.name = "BridgeGroup";
    
    const bridgeGeo = new THREE.BoxGeometry(10, 0.2, 1);
    const bridge = new THREE.Mesh(bridgeGeo, matMetal);
    bridge.position.set(5, 1.6, 0); // spans from center to edge
    
    // Central well
    const wellGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 16);
    const well = new THREE.Mesh(wellGeo, matMetal);
    well.position.y = 0.5;
    
    bridgeGroup.add(bridge, well);
    
    // Scraper arms
    const scraperGeo = new THREE.BoxGeometry(9, 1, 0.1);
    const scraper = new THREE.Mesh(scraperGeo, matMetal);
    scraper.position.set(5, -1, 0);
    bridgeGroup.add(scraper);

    group.add(bridgeGroup);

    // Animation: Rotate the bridge slowly
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const trackByName = new THREE.QuaternionKeyframeTrack(`BridgeGroup.quaternion`, [0, 10, 20], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
    ]);
    const clipByName = new THREE.AnimationClip('rotateBridge', 20, [trackByName]);
    animationClips.push(clipByName);

    return { group, animationClips };
}
