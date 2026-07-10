import { titanium, yellowAccent, darkSteel } from '../utils/materials.js';

export function createDysonSwarmNode(THREE) {
    const group = new THREE.Group();

    // Central Core
    const coreGeo = new THREE.IcosahedronGeometry(15, 2);
    const core = new THREE.Mesh(coreGeo, yellowAccent);
    core.name = "Core";
    group.add(core);

    // Outer Framework
    const frameGeo = new THREE.IcosahedronGeometry(18, 1);
    const frameMat = darkSteel.clone();
    frameMat.wireframe = true;
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // Solar Panels Group
    const panelsGroup = new THREE.Group();
    panelsGroup.name = "Panels";
    group.add(panelsGroup);

    const panelGeo = new THREE.BoxGeometry(50, 1, 20);
    
    // Left panel
    const panelLeft = new THREE.Mesh(panelGeo, titanium);
    panelLeft.position.x = -40;
    panelsGroup.add(panelLeft);

    // Right panel
    const panelRight = new THREE.Mesh(panelGeo, titanium);
    panelRight.position.x = 40;
    panelsGroup.add(panelRight);

    // Animation: Sun tracking rotation
    const times = [0, 5, 10, 15, 20];
    const axis = new THREE.Vector3(1, 0, 0).normalize();
    const values = [];
    for(let i=0; i<=4; i++) {
        const angle = (i/4) * Math.PI * 2;
        const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        values.push(q.x, q.y, q.z, q.w);
    }
    const rotationTrack = new THREE.QuaternionKeyframeTrack('Panels.quaternion', times, values);
    
    // Core pulsating scale
    const scaleTimes = [0, 10, 20];
    const s1 = 1, s2 = 1.1;
    const scaleValues = [
        s1, s1, s1, 
        s2, s2, s2, 
        s1, s1, s1
    ];
    const scaleTrack = new THREE.VectorKeyframeTrack('Core.scale', scaleTimes, scaleValues);

    const clip = new THREE.AnimationClip('SwarmNodeAnim', 20, [rotationTrack, scaleTrack]);

    return { group, animationClips: [clip] };
}
