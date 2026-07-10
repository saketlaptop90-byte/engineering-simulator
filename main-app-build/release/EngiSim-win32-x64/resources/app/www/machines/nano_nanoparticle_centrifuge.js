import { steel, darkSteel, glass, whitePlastic, yellowAccent } from '../utils/materials.js';

export function createNanoparticleCentrifuge(THREE) {
    const group = new THREE.Group();
    group.name = 'Nanoparticle Centrifuge';

    const housingGeo = new THREE.CylinderGeometry(2.5, 2.5, 2, 32, 1, true);
    const housing = new THREE.Mesh(housingGeo, darkSteel);
    group.add(housing);

    const lid = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.1, 32), glass);
    lid.position.y = 1.05;
    group.add(lid);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32), darkSteel);
    base.position.y = -1.25;
    group.add(base);

    const rotor = new THREE.Group();
    group.add(rotor);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), steel);
    rotor.add(hub);

    const tracks = [];
    
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const tubeContainer = new THREE.Group();
        tubeContainer.position.set(1.5 * Math.cos(angle), 0, 1.5 * Math.sin(angle));
        tubeContainer.rotation.z = -Math.PI / 4;
        
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16), glass);
        tubeContainer.add(tube);
        
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.2), whitePlastic);
        cap.position.y = 0.6;
        tubeContainer.add(cap);

        const particle = new THREE.Mesh(new THREE.SphereGeometry(0.12), yellowAccent);
        particle.position.y = 0.3; 
        tubeContainer.add(particle);

        rotor.add(tubeContainer);

        tracks.push(new THREE.VectorKeyframeTrack(
            `${particle.uuid}.position`,
            [0, 2],
            [0, 0.3, 0,  0, -0.4, 0]
        ));
    }

    const numSteps = 16;
    const rotorTimes = [];
    const rotorQuats = [];
    for(let i=0; i<=numSteps; i++) {
        const t = (i / numSteps) * 2;
        const ang = i * Math.PI / 2;
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ang);
        rotorTimes.push(t);
        rotorQuats.push(q.x, q.y, q.z, q.w);
    }
    
    tracks.push(new THREE.QuaternionKeyframeTrack(
        `${rotor.uuid}.quaternion`,
        rotorTimes,
        rotorQuats
    ));

    const clip = new THREE.AnimationClip('Spin', 2, tracks);
    return { group, animationClips: [clip] };
}
