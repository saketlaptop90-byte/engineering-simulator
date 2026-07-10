import { gold, chrome, plastic, redAccent } from '../utils/materials.js';

export function createDipPenNanolithographyRig(THREE) {
    const group = new THREE.Group();
    group.name = 'Dip-Pen Nanolithography Rig';

    const substrate = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 4), gold);
    group.add(substrate);

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 1), plastic);
    bridge.position.set(0, 2, 0);
    group.add(bridge);

    const tracks = [];
    
    const cantileverGeo = new THREE.ConeGeometry(0.1, 1, 16);
    cantileverGeo.translate(0, -0.5, 0); 
    
    for (let i = 0; i < 5; i++) {
        const xPos = -2 + i;
        const c = new THREE.Mesh(cantileverGeo, chrome);
        c.position.set(xPos, 1.8, 0);
        group.add(c);

        const d = new THREE.Mesh(new THREE.SphereGeometry(0.1), redAccent);
        d.position.set(xPos, 0.05, 0);
        d.scale.set(0.01, 0.01, 0.01);
        group.add(d);

        const offset = i * 0.2;
        tracks.push(new THREE.VectorKeyframeTrack(
            `${c.uuid}.position`,
            [0, 0.5 + offset, 0.75 + offset, 1.0 + offset, 2],
            [xPos, 1.8, 0,  xPos, 1.8, 0,  xPos, 1.1, 0,  xPos, 1.8, 0,  xPos, 1.8, 0]
        ));
        
        tracks.push(new THREE.VectorKeyframeTrack(
            `${d.uuid}.scale`,
            [0, 0.75 + offset, 0.85 + offset, 2],
            [0.01, 0.01, 0.01,  0.01, 0.01, 0.01,  1, 1, 1,  1, 1, 1]
        ));
    }

    const clip = new THREE.AnimationClip('Tap', 2, tracks);
    return { group, animationClips: [clip] };
}
