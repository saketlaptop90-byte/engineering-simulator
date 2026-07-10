import { wood, brass, glass, gold } from '../utils/materials.js';

export function createAstrolabe(THREE) {
    const group = new THREE.Group();
    group.name = 'Astrolabe';

    // Base mater
    const mater = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.2, 64), brass);
    mater.position.y = 0.1;
    group.add(mater);

    // Ring at top
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 16, 32), gold);
    ring.position.set(0, 0.1, -2.3);
    group.add(ring);

    // Tympan (plate)
    const tympan = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.22, 64), brass);
    tympan.position.y = 0.11;
    group.add(tympan);

    // Rete (rotating star map)
    const reteGroup = new THREE.Group();
    reteGroup.name = 'Rete';
    reteGroup.position.y = 0.25;

    const reteRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 16, 64), gold);
    reteRing1.rotation.x = Math.PI / 2;
    reteGroup.add(reteRing1);

    const reteRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.02, 16, 64), gold);
    reteRing2.rotation.x = Math.PI / 2;
    reteRing2.position.z = -0.3;
    reteGroup.add(reteRing2);

    for(let i=0; i<8; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 3.2), gold);
        spoke.rotation.y = (i * Math.PI) / 8;
        reteGroup.add(spoke);
    }
    group.add(reteGroup);

    // Alidade (pointer on top)
    const alidadeGroup = new THREE.Group();
    alidadeGroup.name = 'Alidade';
    alidadeGroup.position.y = 0.3;

    const alidade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 3.8), brass);
    alidadeGroup.add(alidade);

    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), gold);
    alidadeGroup.add(pin);

    group.add(alidadeGroup);

    // Animation
    const times = [0, 2.5, 5, 7.5, 10];
    const rQuats = [], aQuats = [];
    
    [0, Math.PI/2, Math.PI, Math.PI*1.5, Math.PI*2].forEach(a => {
        const rq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -a);
        rQuats.push(rq.x, rq.y, rq.z, rq.w);
        
        const aq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), a * 2);
        aQuats.push(aq.x, aq.y, aq.z, aq.w);
    });

    const reteTrack = new THREE.QuaternionKeyframeTrack('Rete.quaternion', times, rQuats);
    const alidadeTrack = new THREE.QuaternionKeyframeTrack('Alidade.quaternion', times, aQuats);

    const clip = new THREE.AnimationClip('AstrolabeMotion', 10, [reteTrack, alidadeTrack]);

    return { group, animationClips: [clip] };
}
