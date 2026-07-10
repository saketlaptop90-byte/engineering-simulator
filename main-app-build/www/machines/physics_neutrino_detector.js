import { materials } from '../utils/materials.js';

export function createNeutrinoDetector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Tank
    const tankGeometry = new THREE.CylinderGeometry(8, 8, 15, 32);
    // Open top so we can see inside
    const tankMaterial = materials.darkSteel.clone();
    tankMaterial.side = THREE.DoubleSide;
    const tank = new THREE.Mesh(tankGeometry, tankMaterial);
    group.add(tank);

    // Ultra-pure Water Fluid Volume
    const fluidGeometry = new THREE.CylinderGeometry(7.8, 7.8, 14.8, 32);
    const fluidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0055ff, 
        transparent: true, 
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1
    });
    const fluid = new THREE.Mesh(fluidGeometry, fluidMaterial);
    group.add(fluid);

    // Photomultiplier tubes lining the walls
    const pmtGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const pmtGroup = new THREE.Group();
    for (let y = -6; y <= 6; y += 3) {
        for (let i = 0; i < 16; i++) {
            const pmt = new THREE.Mesh(pmtGeometry, materials.glass);
            const angle = (i / 16) * Math.PI * 2;
            pmt.position.set(Math.cos(angle) * 7.5, y, Math.sin(angle) * 7.5);
            pmtGroup.add(pmt);
        }
    }
    group.add(pmtGroup);

    // Cherenkov Radiation Flash
    const flashGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const flashMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x88ffff,
        transparent: true,
        opacity: 0
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.name = 'CherenkovFlash';
    group.add(flash);

    // Animation: Sudden flash of Cherenkov radiation
    const times = [0, 0.1, 0.5, 2];
    const opacities = [0, 1, 0, 0];
    const opacityTrack = new THREE.NumberKeyframeTrack('CherenkovFlash.material.opacity', times, opacities);
    
    const scaleTimes = [0, 0.1, 0.5, 2];
    const scaleValues = [
        0, 0, 0, 
        8, 8, 8, 
        0, 0, 0,
        0, 0, 0
    ];
    const scaleTrack = new THREE.VectorKeyframeTrack('CherenkovFlash.scale', scaleTimes, scaleValues);

    const clip = new THREE.AnimationClip('DetectNeutrino', 2, [opacityTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
