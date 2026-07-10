import { metalMaterial, glassMaterial, glowMaterial } from '../utils/materials.js';

export function createSuperconductingQubit(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Sapphire Substrate
    const subGeom = new THREE.BoxGeometry(6, 0.1, 6);
    const subMat = glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0x111122, roughness: 0.1, transmission: 0.5, transparent: true });
    const substrate = new THREE.Mesh(subGeom, subMat);
    group.add(substrate);

    // Ground Plane (Niobium)
    const groundGeom = new THREE.PlaneGeometry(5.8, 5.8);
    const groundMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1, roughness: 0.4 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.06;
    group.add(ground);

    // Cross-shaped Qubit Capacitor
    const crossMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.2 });
    const hBar = new THREE.Mesh(new THREE.BoxGeometry(2, 0.02, 0.4), crossMat);
    hBar.position.y = 0.07;
    group.add(hBar);
    
    const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 2), crossMat);
    vBar.position.y = 0.07;
    group.add(vBar);

    // Josephson Junction
    const jjGeom = new THREE.BoxGeometry(0.1, 0.03, 0.1);
    const jjMat = metalMaterial || new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1 }); // Gold/Aluminum oxide representation
    const jj = new THREE.Mesh(jjGeom, jjMat);
    jj.position.set(0, 0.08, 0.25);
    group.add(jj);

    // Readout Resonator (Meander Line)
    const path = new THREE.CurvePath();
    // Simplified meander
    let zOffset = 1.2;
    for (let i = 0; i < 5; i++) {
        path.add(new THREE.LineCurve3(new THREE.Vector3(-2, 0.07, zOffset), new THREE.Vector3(2, 0.07, zOffset)));
        zOffset += 0.2;
        path.add(new THREE.LineCurve3(new THREE.Vector3(2, 0.07, zOffset - 0.2), new THREE.Vector3(2, 0.07, zOffset)));
        path.add(new THREE.LineCurve3(new THREE.Vector3(2, 0.07, zOffset), new THREE.Vector3(-2, 0.07, zOffset)));
        zOffset += 0.2;
        if (i < 4) {
             path.add(new THREE.LineCurve3(new THREE.Vector3(-2, 0.07, zOffset - 0.2), new THREE.Vector3(-2, 0.07, zOffset)));
        }
    }
    const tubeGeom = new THREE.TubeGeometry(path, 64, 0.02, 8, false);
    const resonator = new THREE.Mesh(tubeGeom, crossMat);
    group.add(resonator);

    // Microwave pulse animation entering resonator
    const pulseGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const pulseMat = glowMaterial || new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const pulse = new THREE.Mesh(pulseGeom, pulseMat);
    group.add(pulse);

    // Animate pulse along the first part of the meander
    const times = [0, 0.5, 1, 1.5, 2];
    const values = [
        -2, 0.1, 1.2,
         2, 0.1, 1.2,
         2, 0.1, 1.4,
        -2, 0.1, 1.4,
        -2, 0.1, 1.6
    ];
    const track = new THREE.VectorKeyframeTrack(pulse.uuid + '.position', times, values);
    
    // Qubit Excitation Glow
    const glowGeom = new THREE.BoxGeometry(2.1, 0.05, 2.1);
    const exciteMat = glowMaterial || new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0 });
    const exciteGlow = new THREE.Mesh(glowGeom, exciteMat);
    exciteGlow.position.y = 0.07;
    group.add(exciteGlow);

    const glowTrack = new THREE.NumberKeyframeTrack(exciteMat.uuid + '.opacity', [0, 2, 2.5, 4], [0, 0, 0.8, 0]);

    animationClips.push(new THREE.AnimationClip('microwave_excitation', 4, [track, glowTrack]));

    return { group, animationClips };
}
