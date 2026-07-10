import { darkSteel, titanium, copper, gold } from '../utils/materials.js';

export function createDirectedEnergyTurret(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base cylinder
    const baseGeometry = new THREE.CylinderGeometry(2, 2.5, 1, 32);
    const base = new THREE.Mesh(baseGeometry, darkSteel);
    group.add(base);

    // Turret Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.5;
    headGroup.name = 'TurretHead';
    group.add(headGroup);

    const headGeometry = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const head = new THREE.Mesh(headGeometry, titanium);
    headGroup.add(head);

    // Energy Barrel
    const barrelGeometry = new THREE.CylinderGeometry(0.3, 0.4, 5, 16);
    const barrel = new THREE.Mesh(barrelGeometry, gold);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0, 2.5);
    headGroup.add(barrel);

    // Energy Beam
    const beamGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
    const beamMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 5, transparent: true, opacity: 0.8 });
    const beam = new THREE.Mesh(beamGeometry, beamMaterial);
    beam.rotation.x = Math.PI / 2;
    beam.position.set(0, 0, 10);
    beam.name = 'EnergyBeam';
    headGroup.add(beam);

    // Animation: Turret sweeping
    const rotationKF = new THREE.NumberKeyframeTrack('TurretHead.rotation[y]', [0, 2, 4], [-Math.PI / 4, Math.PI / 4, -Math.PI / 4]);
    const sweepClip = new THREE.AnimationClip('TurretSweep', 4, [rotationKF]);
    animationClips.push(sweepClip);

    // Animation: Beam firing (opacity toggle)
    const opacityTrack = new THREE.NumberKeyframeTrack('EnergyBeam.material.opacity', [0, 0.1, 0.5, 0.6, 1], [0, 1, 1, 0, 0]);
    const fireClip = new THREE.AnimationClip('BeamFire', 1, [opacityTrack]);
    animationClips.push(fireClip);

    return { group, animationClips };
}
