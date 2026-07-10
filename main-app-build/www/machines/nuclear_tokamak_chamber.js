import * as sharedMaterials from '../utils/materials.js';

export function createTokamakChamber(THREE) {
    const group = new THREE.Group();
    
    // Materials with fallback
    const chamberMat = sharedMaterials.chamber || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.3, wireframe: true });
    const magnetMat = sharedMaterials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.4 });
    const plasmaMat = sharedMaterials.plasma || new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8 });
    
    // Vacuum Torus chamber
    const chamberGeo = new THREE.TorusGeometry( 10, 3, 32, 64 );
    const chamber = new THREE.Mesh( chamberGeo, chamberMat );
    chamber.rotation.x = Math.PI / 2;
    group.add( chamber );
    
    // Superconducting Magnets
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const magnetGeo = new THREE.BoxGeometry(4, 8, 4);
        const magnet = new THREE.Mesh(magnetGeo, magnetMat);
        magnet.position.set(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
        magnet.rotation.y = -angle;
        group.add(magnet);
    }
    
    // High-temperature Plasma ring
    const plasmaGeo = new THREE.TorusGeometry( 10, 1.5, 16, 64 );
    const plasma = new THREE.Mesh( plasmaGeo, plasmaMat );
    plasma.rotation.x = Math.PI / 2;
    group.add( plasma );
    
    // Animation: Plasma pulsing and rotating to simulate confinement
    const times = [0, 1, 2];
    
    const scaleTrack = new THREE.VectorKeyframeTrack(plasma.uuid + '.scale', times, [1,1,1, 1.2,1.2,1.2, 1,1,1]);
    const opacityTrack = new THREE.NumberKeyframeTrack(plasma.uuid + '.material.opacity', times, [0.6, 1.0, 0.6]);
    // Rotation over Z because of Torus default orientation before X rotation
    const rotationTrack = new THREE.NumberKeyframeTrack(plasma.uuid + '.rotation[z]', times, [0, Math.PI, Math.PI * 2]);
    
    const clip = new THREE.AnimationClip('PlasmaConfinement', 2, [scaleTrack, opacityTrack, rotationTrack]);
    
    return { group, animationClips: [clip] };
}
