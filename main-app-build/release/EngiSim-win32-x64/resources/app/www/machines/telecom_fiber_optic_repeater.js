import * as Materials from '../utils/materials.js';

export function createFiberOpticRepeater(THREE) {
    const group = new THREE.Group();
    group.name = "Fiber_Optic_Repeater";

    // Enclosure
    const caseGeo = new THREE.BoxGeometry(4, 2, 1.5);
    const enclosure = new THREE.Mesh(caseGeo, Materials.darkSteel);
    group.add(enclosure);

    const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.8, 0.1), Materials.aluminum);
    frontPanel.position.set(0, 0, 0.76);
    group.add(frontPanel);

    // Fiber Tubes
    const tubeGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const tubeMat = Materials.glass.clone();
    tubeMat.opacity = 0.5;

    const tubeGroup = new THREE.Group();
    group.add(tubeGroup);

    const tubeIn = new THREE.Mesh(tubeGeo, tubeMat);
    tubeIn.rotation.z = Math.PI / 2;
    tubeIn.position.set(-4, 0, 0.8);
    tubeGroup.add(tubeIn);

    const tubeOut = new THREE.Mesh(tubeGeo, tubeMat);
    tubeOut.rotation.z = Math.PI / 2;
    tubeOut.position.set(4, 0, 0.8);
    tubeGroup.add(tubeOut);

    // Optical Pulses
    const pulseGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pulseMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });
    
    const pulsesGroup = new THREE.Group();
    group.add(pulsesGroup);

    const tracks = [];
    const duration = 2;

    for (let i = 0; i < 5; i++) {
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        pulse.name = `pulse_${i}`;
        pulsesGroup.add(pulse);

        const times = [];
        const positions = [];
        const offset = i * (duration / 5);

        for (let t = 0; t <= duration; t += 0.1) {
            let phase = ((t - offset) % duration + duration) % duration;
            let progress = phase / duration;
            // Travel across the repeater from x = -6 to x = 6
            let x = -6 + progress * 12;
            times.push(t);
            positions.push(x, 0, 0.8);
        }
        tracks.push(new THREE.VectorKeyframeTrack(`${pulse.name}.position`, times, positions));
    }

    // Status LED
    const ledGeo = new THREE.BoxGeometry(0.2, 0.2, 0.1);
    const ledMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(1.5, 0.5, 0.82);
    led.name = "StatusLED";
    group.add(led);

    const ledTimes = [0, 0.1, 0.2, 2];
    const ledVals = [0, 1, 0, 0];
    tracks.push(new THREE.NumberKeyframeTrack("StatusLED.material.emissiveIntensity", ledTimes, ledVals));

    const clip = new THREE.AnimationClip("FiberTransmit", duration, tracks);

    return { group, animationClips: [clip] };
}
