import { materials } from '../utils/materials.js';

export function createPlasmaInjector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Injector Barrel
    const barrelGeo = new THREE.CylinderGeometry(1, 2, 10, 32);
    const barrel = new THREE.Mesh(barrelGeo, materials.titanium || new THREE.MeshStandardMaterial({color: 0xdddddd, metalness: 0.9}));
    barrel.rotation.z = Math.PI / 2;
    group.add(barrel);

    // Magnetic accelerating rings
    const ringGeo = new THREE.TorusGeometry(2.5, 0.3, 16, 50);
    const ringMat = materials.magnet || new THREE.MeshStandardMaterial({color: 0x333333});
    
    for(let i = -4; i <= 4; i+=2) {
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.x = i;
        ring.rotation.y = Math.PI / 2;
        group.add(ring);
    }

    // High Voltage Terminals
    const terminalGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const terminal = new THREE.Mesh(terminalGeo, materials.copper || new THREE.MeshStandardMaterial({color: 0xb87333}));
    terminal.position.set(-6, 0, 0);
    group.add(terminal);

    // Plasma Beam
    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const beamMat = materials.plasmaBeam || new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.8});
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    beam.name = 'injector_beam';
    group.add(beam);

    // Animation: Beam width pulsing rapidly during injection sequence
    const beamScaleTrack = new THREE.VectorKeyframeTrack(
        'injector_beam.scale',
        [0, 0.1, 0.2],
        [1, 1, 1, 1.2, 0.5, 1.2, 1, 1, 1]
    );
    const clip = new THREE.AnimationClip('PlasmaInjection', 0.2, [beamScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
