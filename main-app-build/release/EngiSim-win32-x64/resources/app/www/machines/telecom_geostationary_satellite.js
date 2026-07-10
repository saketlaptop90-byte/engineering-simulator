import * as Materials from '../utils/materials.js';

export function createGeostationarySatellite(THREE) {
    const group = new THREE.Group();
    group.name = "Geostationary_Satellite";

    // Main Bus (Chassis)
    const busGeo = new THREE.BoxGeometry(2, 2, 3);
    const busMat = Materials.gold.clone(); // Gold foil simulation
    busMat.roughness = 0.6;
    busMat.metalness = 0.8;
    const bus = new THREE.Mesh(busGeo, busMat);
    group.add(bus);

    // Solar Panels
    const panelGroup = new THREE.Group();
    panelGroup.name = "SolarPanels";
    group.add(panelGroup);

    const panelGeo = new THREE.BoxGeometry(8, 0.1, 2);
    const panelMat = Materials.blueAccent.clone();
    panelMat.metalness = 0.9;
    
    const panelL = new THREE.Mesh(panelGeo, panelMat);
    panelL.position.set(-5, 0, 0);
    panelGroup.add(panelL);
    
    const panelR = new THREE.Mesh(panelGeo, panelMat);
    panelR.position.set(5, 0, 0);
    panelGroup.add(panelR);

    // Parabolic Dish
    const dishGroup = new THREE.Group();
    dishGroup.name = "MainDish";
    dishGroup.position.set(0, 1.5, 1);
    group.add(dishGroup);

    const dishGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.4);
    const dish = new THREE.Mesh(dishGeo, Materials.aluminum);
    dish.rotation.x = -Math.PI / 2;
    dishGroup.add(dish);

    const feedGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
    const feed = new THREE.Mesh(feedGeo, Materials.darkSteel);
    feed.position.set(0, 0.75, 0);
    dishGroup.add(feed);

    // Indicator Beacon
    const beaconGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const beaconMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 0, 1.6);
    beacon.name = "SatBeacon";
    bus.add(beacon);

    // Animations
    const duration = 10;
    
    // Solar Panels subtle tracking rotation
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, 0));
    const panelTrack = new THREE.QuaternionKeyframeTrack("SolarPanels.quaternion", [0, 5, 10], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q1.x, q1.y, q1.z, q1.w
    ]);

    // Dish re-orientation
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.3, 0));
    const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.3, 0));
    const dishTrack = new THREE.QuaternionKeyframeTrack("MainDish.quaternion", [0, 2.5, 7.5, 10], [
        q1.x, q1.y, q1.z, q1.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w,
        q1.x, q1.y, q1.z, q1.w
    ]);

    // Blinking telemetry beacon
    const bTimes = [];
    const bVals = [];
    for(let t=0; t<=10; t+=0.5) {
        bTimes.push(t);
        bVals.push(t % 1 === 0 ? 1 : 0);
    }
    const beaconTrack = new THREE.NumberKeyframeTrack("SatBeacon.material.emissiveIntensity", bTimes, bVals);

    const clip = new THREE.AnimationClip("SatOrbit", duration, [panelTrack, dishTrack, beaconTrack]);

    return { group, animationClips: [clip] };
}
