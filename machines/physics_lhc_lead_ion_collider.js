import { titanium, copper, gold, darkSteel } from '../utils/materials.js';

export function createLhcLeadIonCollider(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Collision chamber
    const chamberGeo = new THREE.SphereGeometry(5, 32, 32);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0x444444, wireframe: true });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    group.add(chamber);

    // Beam pipes
    const pipeGeo = new THREE.CylinderGeometry(1, 1, 20, 32);
    const pipe = new THREE.Mesh(pipeGeo, darkSteel);
    pipe.rotation.z = Math.PI / 2;
    group.add(pipe);

    // Detector rings
    const ringGroup = new THREE.Group();
    ringGroup.name = 'detectorRings';
    for (let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(3 + i * 0.5, 0.2, 16, 100);
        const ring = new THREE.Mesh(ringGeo, i % 2 === 0 ? copper : gold);
        ring.rotation.y = Math.PI / 2;
        ringGroup.add(ring);
    }
    group.add(ringGroup);

    // Lead Ions
    const ion1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), gold);
    const ion2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), gold);
    ion1.name = 'ion1';
    ion2.name = 'ion2';
    group.add(ion1);
    group.add(ion2);

    // Explosion particles
    const explosionGroup = new THREE.Group();
    explosionGroup.name = 'explosion';
    for (let i = 0; i < 30; i++) {
        const pGeo = new THREE.SphereGeometry(0.1 + Math.random() * 0.1);
        const pMat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xff5500 : 0xffff00 });
        const p = new THREE.Mesh(pGeo, pMat);
        p.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        explosionGroup.add(p);
    }
    explosionGroup.scale.set(0.01, 0.01, 0.01);
    group.add(explosionGroup);

    // Animation tracks
    const times = [0, 1, 2];
    const pos1 = [-10, 0, 0,  0, 0, 0,  0, 0, 0];
    const pos2 = [10, 0, 0,   0, 0, 0,  0, 0, 0];
    const expScale = [0.01, 0.01, 0.01,  1, 1, 1,  0.01, 0.01, 0.01];
    const ringTimes = [0, 2];
    const ringRot = [0, 0, 0,  Math.PI * 2, 0, 0];

    const t1 = new THREE.VectorKeyframeTrack('ion1.position', times, pos1);
    const t2 = new THREE.VectorKeyframeTrack('ion2.position', times, pos2);
    const t3 = new THREE.VectorKeyframeTrack('explosion.scale', times, expScale);
    const t4 = new THREE.VectorKeyframeTrack('detectorRings.rotation', ringTimes, ringRot);

    const clip = new THREE.AnimationClip('Collide', 2, [t1, t2, t3, t4]);
    animationClips.push(clip);

    return { group, animationClips };
}
