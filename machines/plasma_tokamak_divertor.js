import { copper, darkSteel, gold, aluminum } from '../utils/materials.js';

export function createTokamakDivertor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Toroidal vacuum vessel segment
    const vesselGeo = new THREE.TorusGeometry(10, 3, 32, 64, Math.PI / 2);
    const vesselMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.5 });
    const vessel = new THREE.Mesh(vesselGeo, darkSteel);
    // Overriding the darkSteel material's opacity for visibility
    vessel.material = vesselMat; 
    group.add(vessel);

    // Divertor plates (bottom of vessel)
    const plateGeo = new THREE.BoxGeometry(4, 0.5, 20);
    const divertorPlate = new THREE.Mesh(plateGeo, aluminum);
    divertorPlate.position.set(10, -3, 0);
    group.add(divertorPlate);

    // Magnetic coils
    for (let i = 0; i <= 4; i++) {
        const coilGeo = new THREE.TorusGeometry(3.5, 0.5, 16, 32);
        const coil = new THREE.Mesh(coilGeo, copper);
        const angle = (i * Math.PI) / 8;
        coil.position.set(10 * Math.cos(angle), 0, 10 * Math.sin(angle));
        coil.lookAt(0, 0, 0);
        group.add(coil);
    }

    // Plasma flow to divertor
    const plasmaGeo = new THREE.TorusGeometry(10, 0.5, 16, 64, Math.PI / 2);
    const plasmaMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.6 });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.name = 'PlasmaCore';
    group.add(plasma);

    // Animation: Plasma pulsing
    const times = [0, 1, 2];
    const opacities = [0.2, 0.9, 0.2];
    const track = new THREE.NumberKeyframeTrack('PlasmaCore.material.opacity', times, opacities);
    const clip = new THREE.AnimationClip('PlasmaFlow', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
