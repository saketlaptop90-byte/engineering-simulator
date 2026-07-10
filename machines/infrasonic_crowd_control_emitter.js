import { darkSteel, titanium, gold } from '../utils/materials.js';

export function createInfrasonicCrowdControlEmitter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tripod Base
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
    for(let i=0; i<3; i++) {
        const leg = new THREE.Mesh(legGeo, darkSteel);
        const angle = (i * Math.PI * 2) / 3;
        leg.position.set(Math.cos(angle)*1, 1.5, Math.sin(angle)*1);
        leg.lookAt(0, 3, 0);
        leg.rotateX(Math.PI/2);
        group.add(leg);
    }

    const mount = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), darkSteel);
    mount.position.y = 3;
    group.add(mount);

    // LRAD Panel
    const panelGroup = new THREE.Group();
    panelGroup.name = 'panelGroup';
    panelGroup.position.y = 3;
    group.add(panelGroup);

    const panelGeo = new THREE.BoxGeometry(2.5, 2.5, 0.5);
    const panel = new THREE.Mesh(panelGeo, titanium);
    panelGroup.add(panel);

    // Speaker Grid
    const speakerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    for(let x=-1; x<=1; x++) {
        for(let y=-1; y<=1; y++) {
            const spk = new THREE.Mesh(speakerGeo, gold);
            spk.position.set(x * 0.8, y * 0.8, 0.25);
            spk.rotation.x = Math.PI / 2;
            panelGroup.add(spk);
        }
    }

    // Infrasonic Waves
    const waveGeo = new THREE.RingGeometry(1, 1.2, 32);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const waves = [];
    for(let i=0; i<4; i++) {
        const wave = new THREE.Mesh(waveGeo, waveMat);
        wave.name = `wave_${i}`;
        wave.position.z = 0.5;
        panelGroup.add(wave);
        waves.push(wave);
    }

    const tracks = [];
    
    // Panel Sweeping
    const pTimes = [0, 2, 4];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/4);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/4);
    tracks.push(new THREE.QuaternionKeyframeTrack(`panelGroup.quaternion`, pTimes, [
        ...q1.toArray(), ...q2.toArray(), ...q1.toArray()
    ]));

    // Waves expanding
    waves.forEach((w, idx) => {
        const sc = 1 + idx*0.5;
        const maxSc = sc + 2;
        tracks.push(new THREE.VectorKeyframeTrack(`${w.name}.scale`, [0, 1, 2, 3, 4], [
            sc,sc,sc, maxSc,maxSc,maxSc, sc,sc,sc, maxSc,maxSc,maxSc, sc,sc,sc
        ]));
    });

    animationClips.push(new THREE.AnimationClip('CrowdControlAction', 4, tracks));

    return { group, animationClips };
}
