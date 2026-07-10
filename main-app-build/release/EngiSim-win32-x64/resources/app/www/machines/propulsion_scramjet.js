import { titanium, steel, copper } from '../utils/materials.js';

export function createScramjet(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Scramjet Body Profile
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(2, 1);
    shape.lineTo(8, 1);
    shape.lineTo(10, 0);
    shape.lineTo(8, -0.5);
    shape.lineTo(2, -0.5);
    shape.lineTo(0, 0);

    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const bodyGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const bodyMat = titanium.clone();
    bodyMat.wireframe = true; // See-through to observe internal aerodynamics
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.z = -1;
    group.add(body);

    // Internal Airflow visualization
    const flowGeo = new THREE.CylinderGeometry(0.1, 0.1, 10, 8);
    const flowMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5 });
    
    const flowGroup = new THREE.Group();
    flowGroup.name = "airflow";
    
    for(let i=0; i<5; i++) {
        const flow = new THREE.Mesh(flowGeo, flowMat);
        flow.rotation.z = Math.PI / 2;
        flow.position.y = 0.25;
        flow.position.z = -0.5 + i * 0.25;
        flow.position.x = 5;
        flowGroup.add(flow);
    }
    group.add(flowGroup);

    // Combustion Shockwave
    const shockGeo = new THREE.ConeGeometry(1, 2, 16);
    const shockMat = new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.7, wireframe: true });
    const shock = new THREE.Mesh(shockGeo, shockMat);
    shock.rotation.z = -Math.PI / 2;
    shock.position.set(6, 0.25, 0);
    shock.name = "shockwave";
    group.add(shock);

    // Supersonic Exhaust
    const exhaustGeo = new THREE.CylinderGeometry(0.1, 1.5, 4, 32);
    const exhaustMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaust.rotation.z = -Math.PI / 2;
    exhaust.position.set(10, 0.25, 0);
    exhaust.name = "exhaust";
    group.add(exhaust);

    // Animation Keyframes
    const times = [0, 0.5, 1];
    
    const flowScaleValues = [1, 1, 1, 1.1, 1, 1, 1, 1, 1];
    const flowScaleTrack = new THREE.VectorKeyframeTrack('airflow.scale', times, flowScaleValues);

    const shockScaleValues = [1, 1, 1, 1.5, 1.5, 1.5, 1, 1, 1];
    const shockScaleTrack = new THREE.VectorKeyframeTrack('shockwave.scale', times, shockScaleValues);

    const exhaustScaleValues = [1, 1, 1, 1.2, 1.1, 1.2, 1, 1, 1];
    const exhaustTrack = new THREE.VectorKeyframeTrack('exhaust.scale', times, exhaustScaleValues);

    const clip = new THREE.AnimationClip('ScramjetDynamics', 1, [flowScaleTrack, shockScaleTrack, exhaustTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
