import { materials } from '../utils/materials.js';

export function createLiquidCoolingBlock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matCopper = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 });
    const matAcrylic = materials?.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const matLiquid = materials?.liquid || new THREE.MeshPhysicalMaterial({ color: 0x00ccff, transmission: 0.5, opacity: 0.9, transparent: true });

    const baseGeo = new THREE.BoxGeometry(10, 0.6, 10);
    const base = new THREE.Mesh(baseGeo, matCopper);
    group.add(base);

    for (let i = 0; i < 25; i++) {
        const finGeo = new THREE.BoxGeometry(0.1, 1.2, 8);
        const fin = new THREE.Mesh(finGeo, matCopper);
        fin.position.set((i - 12) * 0.35, 0.9, 0);
        group.add(fin);
    }

    const topGeo = new THREE.BoxGeometry(10, 1.5, 10);
    const top = new THREE.Mesh(topGeo, matAcrylic);
    top.position.y = 1.65;
    group.add(top);

    const liquidGeo = new THREE.BoxGeometry(8.5, 1.0, 8.5);
    const liquid = new THREE.Mesh(liquidGeo, matLiquid);
    liquid.position.y = 1.1;
    liquid.name = 'coolant';
    group.add(liquid);

    const tracks = [];
    const times = [0, 0.5, 1.0, 1.5, 2.0];
    
    const scaleTrack = new THREE.VectorKeyframeTrack(
        `${liquid.name}.scale`,
        times,
        [1, 1, 1,  1.02, 1.05, 1.02,  1, 1, 1,  1.02, 1.05, 1.02,  1, 1, 1]
    );
    
    const posTrack = new THREE.VectorKeyframeTrack(
        `${liquid.name}.position`,
        times,
        [0, 1.1, 0,  0, 1.12, 0,  0, 1.1, 0,  0, 1.12, 0,  0, 1.1, 0]
    );

    tracks.push(scaleTrack);
    tracks.push(posTrack);

    const clip = new THREE.AnimationClip('CoolantFlow', 2.0, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
