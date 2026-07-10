import { metalMaterial, glassMaterial, glowingMaterial, darkMaterial } from '../utils/materials.js';

export function createSonarPhasedArray(THREE) {
    const group = new THREE.Group();
    const mMetal = metalMaterial || new THREE.MeshStandardMaterial({ color: 0x445566, roughness: 0.3, metalness: 0.9 });
    const mEmitter = glowingMaterial || new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true });

    const frame = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 1), mMetal);
    group.add(frame);

    const transducers = [];
    for (let x = -2.5; x <= 2.5; x += 1) {
        for (let y = -2.5; y <= 2.5; y += 1) {
            const transducer = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), mMetal);
            transducer.rotation.x = Math.PI / 2;
            transducer.position.set(x, y, 0.5);
            transducers.push({ mesh: transducer, ox: x, oy: y });
            group.add(transducer);
        }
    }

    const beams = [];
    for(let i = 0; i < 5; i++) {
        const beamGeo = new THREE.ConeGeometry(0.5, 4, 32);
        beamGeo.translate(0, 2, 0); // Origin at base
        const beam = new THREE.Mesh(beamGeo, mEmitter.clone());
        beam.rotation.x = Math.PI / 2;
        beam.position.z = 0.6;
        beams.push(beam);
        group.add(beam);
    }

    group.userData.update = (delta, time) => {
        const targetX = Math.sin(time) * 3;
        const targetY = Math.cos(time * 0.8) * 3;

        transducers.forEach(t => {
            // Phased delay simulation
            const dist = Math.sqrt((t.ox - targetX)**2 + (t.oy - targetY)**2);
            const phase = time * 5 - dist;
            t.mesh.position.z = 0.5 + Math.sin(phase) * 0.1;
        });

        // Steer beams
        beams.forEach((beam, i) => {
            const t = (time + i) % 2;
            beam.scale.setScalar(1 + t * 2);
            beam.material.opacity = (1 - t) * 0.5;
            beam.lookAt(targetX, targetY, 10);
        });
    };

    return { group, animationClips: [] };
}
