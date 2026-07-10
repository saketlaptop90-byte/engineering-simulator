import { steel, titanium, darkSteel } from '../utils/materials.js';

export function createSteamTurbine(THREE) {
    const group = new THREE.Group();
    group.name = "SteamTurbineRotor";

    const rotorGroup = new THREE.Group();
    rotorGroup.name = "Rotor";
    group.add(rotorGroup);

    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 32);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, darkSteel);
    rotorGroup.add(shaft);

    // Stages
    const numStages = 8;
    for (let i = 0; i < numStages; i++) {
        const stageRadius = 1.5 + (i * 0.2);
        const xPos = -4 + (i * 1.1);

        const diskGeo = new THREE.CylinderGeometry(stageRadius * 0.5, stageRadius * 0.5, 0.4, 32);
        diskGeo.rotateZ(Math.PI / 2);
        const disk = new THREE.Mesh(diskGeo, titanium);
        disk.position.x = xPos;
        rotorGroup.add(disk);

        const numBlades = 24 + i * 2;
        for (let j = 0; j < numBlades; j++) {
            const angle = (j / numBlades) * Math.PI * 2;
            const bladeLength = stageRadius * 0.6;
            const bladeGeo = new THREE.BoxGeometry(0.3, bladeLength, 0.05);
            bladeGeo.translate(0, bladeLength / 2, 0);
            
            const blade = new THREE.Mesh(bladeGeo, steel);
            blade.position.set(xPos, 0, 0);
            blade.rotation.x = angle;
            blade.rotation.y = Math.PI / 6; // blade pitch
            rotorGroup.add(blade);
        }
    }

    // Housing Base (Static)
    const baseGeo = new THREE.BoxGeometry(10, 1, 4);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -3.5, 0);
    group.add(base);

    // Supports
    const supportGeo = new THREE.BoxGeometry(1, 4, 2);
    const support1 = new THREE.Mesh(supportGeo, darkSteel);
    support1.position.set(-5, -1.5, 0);
    group.add(support1);

    const support2 = new THREE.Mesh(supportGeo, darkSteel);
    support2.position.set(5, -1.5, 0);
    group.add(support2);

    // Animation: Spinning Rotor
    const numSteps = 16;
    const times = [];
    const values = [];
    const duration = 2.0;
    for(let i=0; i<=numSteps; i++) {
        times.push((i / numSteps) * duration);
        const angle = (i / numSteps) * Math.PI * 2;
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
        values.push(...q.toArray());
    }

    const track = new THREE.QuaternionKeyframeTrack('Rotor.quaternion', times, values);
    const clip = new THREE.AnimationClip('Spin', duration, [track]);

    return { group, animationClips: [clip] };
}

// Auto-generated missing stub
export function createSteamTurbineRotor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
