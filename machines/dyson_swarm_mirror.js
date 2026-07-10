import { aluminum, titanium, glass } from '../utils/materials.js';

export function createDysonSwarmMirror(THREE) {
    const group = new THREE.Group();
    group.name = "DysonMirror";
    const animationClips = [];

    // Central Hub
    const hubGeo = new THREE.IcosahedronGeometry(5, 1);
    const hub = new THREE.Mesh(hubGeo, titanium);
    group.add(hub);

    // Mirror Panel
    const panelGeo = new THREE.CylinderGeometry(20, 20, 0.5, 6);
    const panel = new THREE.Mesh(panelGeo, glass); // glass as highly reflective
    panel.rotation.x = Math.PI / 2;
    panel.position.z = 2;
    group.add(panel);

    // Support Struts
    const strutGeo = new THREE.CylinderGeometry(0.5, 0.5, 20);
    for(let i=0; i<3; i++) {
        const strut = new THREE.Mesh(strutGeo, aluminum);
        const angle = i * Math.PI * 2 / 3;
        strut.position.set(Math.cos(angle)*10, Math.sin(angle)*10, 1);
        strut.lookAt(Math.cos(angle)*20, Math.sin(angle)*20, 2);
        strut.rotation.x += Math.PI / 2;
        group.add(strut);
    }

    // Animation: Mirror tracking/rotating slightly
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.2);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.2);
    
    const trackTrack = new THREE.QuaternionKeyframeTrack(
        'DysonMirror.quaternion',
        [0, 5, 10],
        [
            q0.x, q0.y, q0.z, q0.w,
            q1.x, q1.y, q1.z, q1.w,
            q0.x, q0.y, q0.z, q0.w
        ]
    );

    const trackClip = new THREE.AnimationClip('MirrorTrack', 10, [trackTrack]);
    animationClips.push(trackClip);

    return { group, animationClips };
}
