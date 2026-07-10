import * as materials from '../utils/materials.js';

export function createAudioLimiterCompressorTube(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tube Glass
    const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const topGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    
    const tubeGlass = new THREE.Group();
    const tubeMat = materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 0.1, transparent: true, roughness: 0 });
    
    const cylinder = new THREE.Mesh(tubeGeo, tubeMat);
    tubeGlass.add(cylinder);
    
    const dome = new THREE.Mesh(topGeo, tubeMat);
    dome.position.y = 1.5;
    tubeGlass.add(dome);

    group.add(tubeGlass);

    // Pins
    const pinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
    const pinMat = materials.shinyMetal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1 });
    for (let i = 0; i < 8; i++) {
        const pin = new THREE.Mesh(pinGeo, pinMat);
        const angle = (i / 8) * Math.PI * 2;
        pin.position.set(Math.cos(angle) * 0.5, -1.5, Math.sin(angle) * 0.5);
        group.add(pin);
    }

    // Internal Structure (Anode, Grid, Cathode, Heater)
    const anodeGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16, 1, true);
    const anodeMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, side: THREE.DoubleSide });
    const anode = new THREE.Mesh(anodeGeo, anodeMat);
    group.add(anode);

    // Heater Glow
    const heaterGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.2, 8);
    const heaterMat = new THREE.MeshBasicMaterial({ color: 0xff5500 }); // Glowing orange/red
    const heater = new THREE.Mesh(heaterGeo, heaterMat);
    group.add(heater);

    const heaterLight = new THREE.PointLight(0xff5500, 1, 5);
    group.add(heaterLight);

    // Animation: Heater pulsating, simulating compression gain reduction
    const times = [0, 1, 2, 3, 4];
    const intensityValues = [1, 2, 0.5, 1.5, 1];
    const colorValues = [
        1, 0.3, 0,
        1, 0.5, 0,
        1, 0.2, 0,
        1, 0.4, 0,
        1, 0.3, 0
    ];

    const lightTrack = new THREE.NumberKeyframeTrack(`${heaterLight.uuid}.intensity`, times, intensityValues);
    const colorTrack = new THREE.ColorKeyframeTrack(`${heaterMat.uuid}.color`, times, colorValues);
    
    const clip = new THREE.AnimationClip('compression_glow', 4, [lightTrack, colorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
