import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createSubmarinePowerCable(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer armor, insulation layers, and inner copper conductors
    const layers = [
        { radius: 5, length: 20, material: darkSteel, offset: 0 }, // Armor
        { radius: 4.5, length: 18, material: porcelain, offset: 1 }, // Outer Insulation
        { radius: 3, length: 16, material: darkSteel, offset: 2 }, // Lead Sheath
        { radius: 2.5, length: 14, material: porcelain, offset: 3 }  // Inner Insulation XLPE
    ];

    layers.forEach(layer => {
        const geo = new THREE.CylinderGeometry(layer.radius, layer.radius, layer.length, 32, 1, true, 0, Math.PI); // Half cylinder for cutaway
        const mesh = new THREE.Mesh(geo, layer.material);
        mesh.rotation.z = Math.PI / 2;
        mesh.position.x = layer.offset;
        group.add(mesh);
    });

    // 3 Copper cores
    const coreGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 32);
    const corePos = [
        { y: 1.2, z: 0 },
        { y: -0.6, z: 1.039 },
        { y: -0.6, z: -1.039 }
    ];

    const coresGroup = new THREE.Group();
    coresGroup.name = 'Cores';
    corePos.forEach(pos => {
        const core = new THREE.Mesh(coreGeo, copper);
        core.rotation.z = Math.PI / 2;
        core.position.set(4, pos.y, pos.z);
        coresGroup.add(core);
    });
    group.add(coresGroup);

    // Animate glowing current pulses in the cores
    const scaleTimes = [0, 1, 2];
    const scaleValues = [1, 1, 1, 1.05, 1.05, 1.05, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack('Cores.scale', scaleTimes, scaleValues);
    const clip = new THREE.AnimationClip('CurrentPulse', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
