import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createPowerGridCapacitorBank(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const frameGeo = new THREE.BoxGeometry(20, 10, 10);
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    const canGeo = new THREE.BoxGeometry(2, 6, 4);
    const numCans = 8;
    const spacing = 2.5;

    const cans = new THREE.Group();
    cans.name = 'CapacitorCans';
    for (let i = 0; i < numCans; i++) {
        const can = new THREE.Mesh(canGeo, darkSteel);
        can.position.set((i - numCans/2) * spacing + 1.25, 0, 0);
        
        // Add porcelain bushings on top
        const bushingGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 16);
        const bushing1 = new THREE.Mesh(bushingGeo, porcelain);
        bushing1.position.set(can.position.x, 3.75, 1);
        const bushing2 = new THREE.Mesh(bushingGeo, porcelain);
        bushing2.position.set(can.position.x, 3.75, -1);
        
        cans.add(can);
        cans.add(bushing1);
        cans.add(bushing2);

        // Connect them with copper wire
        if (i > 0) {
            const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, spacing, 8);
            const wire = new THREE.Mesh(wireGeo, copper);
            wire.rotation.z = Math.PI / 2;
            wire.position.set(can.position.x - spacing / 2, 4.5, 1);
            cans.add(wire);
        }
    }
    group.add(cans);

    // Hum / subtle vibration animation
    const times = [0, 0.05, 0.1];
    const values = [0, 0, 0, 0, 0.05, 0, 0, 0, 0];
    const track = new THREE.VectorKeyframeTrack('CapacitorCans.position', times, values);
    const clip = new THREE.AnimationClip('Vibration', 0.1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
