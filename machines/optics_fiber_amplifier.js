import * as sharedMaterials from '../utils/materials.js';

export function createFiberAmplifier(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const getMat = (name, fallback) => (sharedMaterials[name] || (sharedMaterials.default && sharedMaterials.default[name]) || fallback);

    const metalMat = getMat('metal', new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.5 }));
    const fiberMat = getMat('glass', new THREE.MeshPhysicalMaterial({ color: 0x99ff99, transmission: 0.8, transparent: true, roughness: 0.2 }));
    const pumpMat = getMat('laser', new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 }));
    const signalMat = getMat('laser', new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.9 }));

    // Rack / Enclosure
    const rackGeom = new THREE.BoxGeometry(8, 2, 6);
    const rack = new THREE.Mesh(rackGeom, metalMat);
    group.add(rack);

    // Spool of Erbium Doped Fiber
    const spoolGeom = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
    const spool = new THREE.Mesh(spoolGeom, fiberMat);
    spool.position.set(0, 1.2, 0);
    spool.rotation.x = Math.PI / 2;
    group.add(spool);

    // Pump Lasers
    const pump1 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), metalMat);
    pump1.position.set(-2.5, 1.25, -2);
    group.add(pump1);

    const pump2 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), metalMat);
    pump2.position.set(2.5, 1.25, -2);
    group.add(pump2);

    // Pump Fibers (Green)
    const pf1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), pumpMat);
    pf1.rotation.z = Math.PI / 2;
    pf1.position.set(-1, 1.25, -2);
    group.add(pf1);

    const pf2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), pumpMat);
    pf2.rotation.z = Math.PI / 2;
    pf2.position.set(1, 1.25, -2);
    group.add(pf2);

    // WDM Coupler
    const coupler = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1), metalMat);
    coupler.rotation.z = Math.PI / 2;
    coupler.position.set(0, 1.25, -1.5);
    group.add(coupler);

    // Signal Beams (Red)
    const signalIn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), signalMat);
    signalIn.rotation.x = Math.PI / 2;
    signalIn.position.set(0, 1.25, 2);
    group.add(signalIn);

    // Signal pulses traversing the spool
    const pulse1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), signalMat);
    pulse1.name = 'Pulse1';
    group.add(pulse1);

    const pulse2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), signalMat);
    pulse2.name = 'Pulse2';
    group.add(pulse2);

    // Animate the pulses going in circles around the spool
    const times = [];
    const values1 = [];
    const values2 = [];
    const duration = 2;
    const steps = 30;

    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        times.push(t);

        const angle1 = (i / steps) * Math.PI * 4; // 2 revolutions
        const angle2 = angle1 + Math.PI; // offset by half revolution

        values1.push(Math.cos(angle1) * 1.5, 1.2, Math.sin(angle1) * 1.5);
        values2.push(Math.cos(angle2) * 1.5, 1.2, Math.sin(angle2) * 1.5);
    }

    const track1 = new THREE.VectorKeyframeTrack('Pulse1.position', times, values1);
    const track2 = new THREE.VectorKeyframeTrack('Pulse2.position', times, values2);

    // Pulsing pump lasers intensity (scale)
    const scaleTimes = [0, 1, 2];
    const scaleValues = [1, 1, 1,  1.5, 1.5, 1.5,  1, 1, 1];
    const track3 = new THREE.VectorKeyframeTrack('Pulse1.scale', scaleTimes, scaleValues);
    const track4 = new THREE.VectorKeyframeTrack('Pulse2.scale', scaleTimes, scaleValues);

    const clip = new THREE.AnimationClip('AmplifySignal', duration, [track1, track2, track3, track4]);
    animationClips.push(clip);

    return { group, animationClips };
}
