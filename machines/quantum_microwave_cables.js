import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createMicrowaveCables(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Connector
    const connectorGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const connector = new THREE.Mesh(connectorGeo, gold);
    group.add(connector);

    // Cable path
    const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.25, 0),
        new THREE.Vector3(0, 2, 1),
        new THREE.Vector3(1, 3, 2),
        new THREE.Vector3(2, 4, 0)
    ]);

    const cableGeo = new THREE.TubeGeometry(path, 64, 0.1, 8, false);
    const cable = new THREE.Mesh(cableGeo, copper);
    group.add(cable);

    // Microwave pulse effect
    const pulseGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const pulse = new THREE.Mesh(pulseGeo, pulseMat);
    pulse.name = 'Pulse';
    group.add(pulse);

    // Animation: Pulse traveling along the cable
    const pTimes = [];
    const pValues = [];
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        pTimes.push(t);
        const pt = path.getPoint(t);
        pValues.push(pt.x, pt.y, pt.z);
    }
    
    const pulseTrack = new THREE.VectorKeyframeTrack(`${pulse.name}.position`, pTimes, pValues);
    const clip = new THREE.AnimationClip('MicrowavePulse', 1, [pulseTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
