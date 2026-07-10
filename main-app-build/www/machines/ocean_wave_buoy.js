import * as materials from '../utils/materials.js';

export function createWaveBuoy(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Buoy Hull (Spherical)
    const hullGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const hull = new THREE.Mesh(hullGeometry, materials.accent);
    group.add(hull);

    // Solar panels
    const panelGeometry = new THREE.CylinderGeometry(1.55, 1.55, 0.8, 8, 1, true);
    // Custom material for panels
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x222255, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.rotation.x = Math.PI / 8;
    group.add(panel);

    // Antenna tower
    const towerGeometry = new THREE.CylinderGeometry(0.1, 0.2, 2);
    const tower = new THREE.Mesh(towerGeometry, materials.metal);
    tower.position.y = 2.5;
    group.add(tower);

    // Instruments on tower
    const anemometerGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.4);
    const anemometer = new THREE.Mesh(anemometerGeometry, materials.composite);
    anemometer.position.y = 3.5;
    group.add(anemometer);
    
    // Anemometer cups
    const cups = new THREE.Group();
    for(let i=0; i<3; i++) {
        const cupGeo = new THREE.SphereGeometry(0.1, 8, 8, 0, Math.PI);
        const cup = new THREE.Mesh(cupGeo, materials.metal);
        const angle = (i/3) * Math.PI * 2;
        cup.position.set(Math.cos(angle)*0.3, 0, Math.sin(angle)*0.3);
        cup.rotation.y = angle;
        cups.add(cup);
    }
    cups.position.y = 3.7;
    group.add(cups);

    // Mooring line
    const mooringGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5);
    const mooring = new THREE.Mesh(mooringGeometry, materials.rubber);
    mooring.position.y = -3.5;
    group.add(mooring);

    // Wave riding animation (heave, pitch, roll)
    const times = [0, 2, 4, 6];
    const valuesPos = [
        0, 0, 0,
        0, 0.8, 0,
        0, -0.5, 0,
        0, 0, 0
    ];
    
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0.1));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.1, 0, -0.2));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.2, 0, 0.1));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0.1));
    
    const valuesRot = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const heaveTrack = new THREE.VectorKeyframeTrack(`${group.uuid}.position`, times, valuesPos);
    const rollTrack = new THREE.QuaternionKeyframeTrack(`${group.uuid}.quaternion`, times, valuesRot);
    
    // Wind spin
    const spinTimes = [0, 3, 6];
    const sq0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const sq1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 4, 0));
    const sq2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 8, 0));
    
    const spinValues = [
        sq0.x, sq0.y, sq0.z, sq0.w,
        sq1.x, sq1.y, sq1.z, sq1.w,
        sq2.x, sq2.y, sq2.z, sq2.w
    ];
    const spinTrack = new THREE.QuaternionKeyframeTrack(`${cups.uuid}.quaternion`, spinTimes, spinValues);

    const clip = new THREE.AnimationClip('WaveRiding', 6, [heaveTrack, rollTrack, spinTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
