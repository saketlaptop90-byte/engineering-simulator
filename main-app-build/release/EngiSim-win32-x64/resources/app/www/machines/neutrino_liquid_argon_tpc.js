import { materials } from '../utils/materials.js';

export function createLiquidArgonTPC(THREE) {
    const group = new THREE.Group();
    group.name = 'LiquidArgonTPC';
    const animationClips = [];

    // Cryostat Outer Vessel
    const vesselGeo = new THREE.BoxGeometry(4, 3, 5);
    const vesselMat = materials?.steel || new THREE.MeshStandardMaterial({ color: 0xa0a0a0, metalness: 0.6, roughness: 0.4 });
    const vessel = new THREE.Mesh(vesselGeo, vesselMat);
    vessel.material.transparent = true;
    vessel.material.opacity = 0.2;
    group.add(vessel);

    // Anode/Cathode Planes
    const planeGeo = new THREE.PlaneGeometry(3.8, 4.8);
    const planeMat = materials?.gold || new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2, wireframe: true });
    
    const anode = new THREE.Mesh(planeGeo, planeMat);
    anode.position.x = 1.8;
    anode.rotation.y = -Math.PI / 2;
    group.add(anode);

    const cathode = new THREE.Mesh(planeGeo, planeMat);
    cathode.position.x = -1.8;
    cathode.rotation.y = Math.PI / 2;
    group.add(cathode);

    // Particle Trail (electrons drifting to anode)
    const trailGeo = new THREE.BufferGeometry();
    const trailCount = 100;
    const positions = new Float32Array(trailCount * 3);
    for(let i=0; i<trailCount; i++) {
        positions[i*3] = -1.5 + (i/trailCount)*3;
        positions[i*3+1] = Math.sin(i * 0.2) * 0.5;
        positions[i*3+2] = Math.cos(i * 0.15) * 1.5;
    }
    trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const trailMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05, transparent: true, opacity: 0.8 });
    const trail = new THREE.Points(trailGeo, trailMat);
    trail.name = 'ParticleTrail';
    group.add(trail);

    // Animation: Trail drifting towards Anode
    const driftTrack = new THREE.VectorKeyframeTrack(
        `ParticleTrail.position`,
        [0, 2, 4],
        [0, 0, 0, 1.5, 0, 0, 0, 0, 0] // Drifts right
    );

    const opacityTrack = new THREE.NumberKeyframeTrack(
        `ParticleTrail.material.opacity`,
        [0, 1.5, 2, 4],
        [0.8, 0.8, 0, 0.8]
    );

    const clip = new THREE.AnimationClip('ElectronDrift', 4, [driftTrack, opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
