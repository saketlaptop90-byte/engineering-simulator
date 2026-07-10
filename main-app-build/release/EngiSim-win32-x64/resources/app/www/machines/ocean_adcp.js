import { materials } from '../utils/materials.js';

export function createADCP(THREE) {
    const group = new THREE.Group();
    group.name = "ADCP";
    const animationClips = [];

    const bodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);
    const body = new THREE.Mesh(bodyGeo, materials.metal || new THREE.MeshStandardMaterial({color: 0xcccccc}));
    group.add(body);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.75;
    body.add(headGroup);

    const numTransducers = 4;
    const waveTracks = [];

    for (let i = 0; i < numTransducers; i++) {
        const angle = (i / numTransducers) * Math.PI * 2;
        const headGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
        const head = new THREE.Mesh(headGeo, materials.highlight || new THREE.MeshStandardMaterial({color: 0xffaa00}));
        head.position.set(Math.cos(angle) * 0.4, 0.1, Math.sin(angle) * 0.4);
        
        // Tilt outwards
        const tilt = new THREE.Group();
        tilt.position.copy(head.position);
        tilt.rotation.y = -angle;
        tilt.rotation.x = Math.PI / 6;
        headGroup.add(tilt);
        
        head.position.set(0, 0, 0);
        tilt.add(head);

        // Sound waves
        const waveGroup = new THREE.Group();
        waveGroup.name = `ADCP_WaveGroup_${i}`;
        tilt.add(waveGroup);

        for (let j = 0; j < 3; j++) {
            const waveGeo = new THREE.ConeGeometry(0.2, 0.5, 16, 1, true);
            const waveMat = (materials.glass || new THREE.MeshStandardMaterial({transparent: true, opacity: 0.5})).clone();
            const wave = new THREE.Mesh(waveGeo, waveMat);
            wave.position.y = 0.5 + j * 0.8;
            wave.name = `ADCP_Wave_${i}_${j}`;
            waveGroup.add(wave);

            const scaleTrack = new THREE.VectorKeyframeTrack(
                `${wave.name}.scale`,
                [0, 1, 2],
                [0.1, 0.1, 0.1, 2, 2, 2, 0.1, 0.1, 0.1]
            );
            const posTrack = new THREE.VectorKeyframeTrack(
                `${wave.name}.position`,
                [0, 1, 2],
                [0, 0.2, 0, 0, 2, 0, 0, 4, 0]
            );
            waveTracks.push(scaleTrack, posTrack);
        }
    }

    if (waveTracks.length > 0) {
        animationClips.push(new THREE.AnimationClip('Ping', 2, waveTracks));
    }

    return { group, animationClips };
}
