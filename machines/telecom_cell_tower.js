import * as Materials from '../utils/materials.js';

export function createCellTower(THREE) {
    const group = new THREE.Group();
    group.name = "5G_Cell_Tower";

    // Tower Base
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 16);
    const base = new THREE.Mesh(baseGeo, Materials.darkSteel);
    base.position.y = 0.5;
    group.add(base);

    // Mast
    const mastGeo = new THREE.CylinderGeometry(0.3, 0.4, 20, 8);
    const mast = new THREE.Mesh(mastGeo, Materials.aluminum);
    mast.position.y = 11;
    group.add(mast);

    // Platform
    const platformGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16);
    const platform = new THREE.Mesh(platformGeo, Materials.steel);
    platform.position.y = 18;
    group.add(platform);

    // 5G Antennas
    const antennasGroup = new THREE.Group();
    antennasGroup.position.y = 19;
    group.add(antennasGroup);

    const antennaGeo = new THREE.BoxGeometry(0.2, 1.5, 0.4);
    for (let i = 0; i < 3; i++) {
        const antenna = new THREE.Mesh(antennaGeo, Materials.whitePlastic);
        const angle = (i / 3) * Math.PI * 2;
        antenna.position.set(Math.cos(angle) * 1.0, 0, Math.sin(angle) * 1.0);
        antenna.rotation.y = -angle;
        antennasGroup.add(antenna);
    }

    // Top Blinking Beacon
    const blinkLightGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const blinkMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0 });
    const blinkLight = new THREE.Mesh(blinkLightGeo, blinkMat);
    blinkLight.position.y = 21.2;
    blinkLight.name = "BlinkLight";
    group.add(blinkLight);

    // Signal Waves (Emissive rings)
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const waveGeo = new THREE.TorusGeometry(1, 0.05, 8, 32);
    
    const wavesGroup = new THREE.Group();
    wavesGroup.position.y = 19;
    wavesGroup.rotation.x = Math.PI / 2;
    group.add(wavesGroup);

    const waveTracks = [];
    const duration = 3;

    for (let i = 0; i < 3; i++) {
        const wave = new THREE.Mesh(waveGeo, waveMat.clone());
        wave.name = `wave_${i}`;
        wavesGroup.add(wave);

        const offset = i * (duration / 3);
        const times = [];
        const scales = [];
        const opacities = [];
        
        for (let t = 0; t <= duration; t += 0.25) {
            let phase = ((t - offset) % duration + duration) % duration;
            let progress = phase / duration;
            
            times.push(t);
            let s = 0.1 + progress * 6;
            scales.push(s, s, s);
            let o = 0.8 * (1 - progress);
            opacities.push(o);
        }
        
        waveTracks.push(new THREE.VectorKeyframeTrack(`${wave.name}.scale`, times, scales));
        waveTracks.push(new THREE.NumberKeyframeTrack(`${wave.name}.material.opacity`, times, opacities));
    }

    // Track for blink light
    const bTimes = [0, 0.5, 1, 1.5, 2, 2.5, 3];
    const bVals = [0, 1, 0, 1, 0, 1, 0];
    const blinkTrack = new THREE.NumberKeyframeTrack("BlinkLight.material.emissiveIntensity", bTimes, bVals);

    const clip = new THREE.AnimationClip("TowerOperations", duration, [blinkTrack, ...waveTracks]);

    return { group, animationClips: [clip] };
}
