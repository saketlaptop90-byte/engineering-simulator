import { glass, titanium, purpleAccent, greenAccent, blueAccent, orangeAccent } from '../utils/materials.js';

export function createQuantumDotSynthesizer(THREE) {
    const group = new THREE.Group();
    group.name = 'Quantum Dot Synthesizer';

    const chamber = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), glass);
    group.add(chamber);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1), titanium);
    base.position.y = -2;
    group.add(base);

    const dots = [];
    const colors = [purpleAccent, greenAccent, blueAccent, orangeAccent];
    for (let i = 0; i < 20; i++) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), colors[i % colors.length]);
        dot.position.set(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
        );
        group.add(dot);
        dots.push(dot);
    }

    const tracks = [];
    for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const endPos = new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
        );
        tracks.push(new THREE.VectorKeyframeTrack(
            `${d.uuid}.position`,
            [0, 2, 4],
            [d.position.x, d.position.y, d.position.z,  endPos.x, endPos.y, endPos.z,  d.position.x, d.position.y, d.position.z]
        ));
        tracks.push(new THREE.VectorKeyframeTrack(
            `${d.uuid}.scale`,
            [0, 1, 2, 3, 4],
            [1,1,1,  2,2,2,  0.5,0.5,0.5,  1.5,1.5,1.5,  1,1,1]
        ));
    }

    const clip = new THREE.AnimationClip('Synthesize', 4, tracks);
    return { group, animationClips: [clip] };
}
